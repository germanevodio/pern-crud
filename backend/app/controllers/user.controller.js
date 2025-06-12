import { log } from "console";
import db from "../models/index.js";
import bcrypt from "bcryptjs";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/temp'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB max
    }
});

export const uploadProfilePicture = upload.single('profilePicture');

const Op = db.Sequelize.Op;
const User = db.users;

export const create = async (req, res) => {
    const profilePicturePath = req.file ? `/uploads/temp/${req.file.filename}` : '';

    const address = {
        street: req.body.street,
        number: req.body.number,
        city: req.body.city,
        postalCode: req.body.postalCode,
    };

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        status: req.body.status,
        address,
        profilePicture: profilePicturePath,
        password: hashedPassword,
    };

    User.create(user)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Unhandled error ocurred creating the user.",
            });
        });
};

export const findAll = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const offset = (page - 1) * limit;

    const role = req.query.role;
    const status = req.query.status;
    const search = req.query.search;

    const condition = {};

    if (role) {
        condition.role = role;
    }

    if (status) {
        condition.status = status;
    }

    if (search) {
        condition[Op.or] = [
            { firstName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
        ];
    };

    User.findAndCountAll({
        where: condition,
        limit,
        offset
    })
        .then((data) => {
            const totalItems = data.count;
            const users = data.rows;
            const totalPages = Math.ceil(totalItems / limit);

            res.send({
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                data: users,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Unhandled error occurred in get Users.",
            });
        });
};

export const findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Unhandled error ocurred in get User id=${id}`,
            });
        });
};

export const update = async (req, res) => {
    const id = req.params.id;

    const profilePicturePath = req.file ? `/uploads/temp/${req.file.filename}` : '';

    const address = {
        street: req.body.street,
        number: req.body.number,
        city: req.body.city,
        postalCode: req.body.postalCode,
    };

    const password = req.body.password;

    let hashedPassword = "";

    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        status: req.body.status,
        address,
    };

    if (password) {
        user.password = hashedPassword;
    }

    if (profilePicturePath) {
        user.profilePicture = profilePicturePath;
    }

    User.update(user, {
        where: { id },
    })
        .then((num) => {
            if (num.includes(1)) {
                res.send({
                    message: "User updated successfully",
                });
            } else {
                res.send({
                    message: `Cannot update User id=${id}`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Unhandled error updating User id=${id}`,
            });
        });
};

export const deleteOne = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id },
    })
        .then((num) => {
            if (num === 1) {
                res.send({
                    message: "User deleted successfully",
                });
            } else {
                res.send({
                    message: `Cannot delete User id=${id}`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Unhandled error in delete User id=${id}`,
            });
        });
};
