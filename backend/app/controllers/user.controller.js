import db from "../models/index.js";
import bcrypt from "bcryptjs";

const Op = db.Sequelize.Op;
const User = db.users;

export const create = async (req, res) => {
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
        profilePicture: req.body.profilePicture,
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
        profilePicture: req.body.profilePicture,
    };

    if (password) {
        user.password = hashedPassword;
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
