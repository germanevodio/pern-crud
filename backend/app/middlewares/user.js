import db from "../models/index.js";
import { check, query, validationResult } from 'express-validator';

const ROLES = db.ROLES;
const User = db.users;

const checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        const id = req.body.id || req.params.id || 0;

        if (user && user.id != id) {
            return res.status(400).json({ message: "Failed, Email is already in use" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkRoleExist = (req, res, next) => {
    const role = req.body.role;

    if (!ROLES.includes(role)) {
        return res
            .status(400)
            .json({ message: `Failed, Role does not exist: ${role}` });
    }

    next();
};

const validateCreation = [
    check('firstName')
        .notEmpty()
        .withMessage('firstName is required')
        .isString()
        .withMessage('The firstName must be a text string.'),
    check('lastName')
        .notEmpty()
        .withMessage('lastName is required')
        .isString()
        .withMessage('The lastName must be a text string.'),
    check('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('The email must be a valid email address.')
        .normalizeEmail(),
    check('phoneNumber')
        .notEmpty()
        .withMessage('phoneNumber is required')
        .isMobilePhone()
        .withMessage('The phoneNumber is invalid.'),
    check('role')
        .notEmpty()
        .withMessage('role is required')
        .isString()
        .withMessage('The role must be a text string.'),
    check('status')
        .notEmpty()
        .withMessage('status is required')
        .isString()
        .withMessage('The status must be a text string.'),
    check('street')
        .notEmpty()
        .withMessage('street is required')
        .isString()
        .withMessage('The street must be a text string.'),
    check('number')
        .notEmpty()
        .withMessage('strret number is required')
        .isString()
        .withMessage('The street number must be a text string.'),
    check('city')
        .notEmpty()
        .withMessage('city is required')
        .isString()
        .withMessage('The city must be a text string.'),
    check('postalCode')
        .notEmpty()
        .withMessage('postalCode is required')
        .isString()
        .withMessage('The postalCode must be a text string.'),
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('The password is to short.'),
    checkRoleExist,
    checkDuplicateEmail,
    (req, res, next) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.array();
            return res.status(400).json({ message: errors[0]?.msg || "Unhandled error" });
        }

        next();
    },
];

const validateUpdate = [
    check('firstName')
        .notEmpty()
        .withMessage('firstName is required')
        .isString()
        .withMessage('The firstName must be a text string.'),
    check('lastName')
        .notEmpty()
        .withMessage('lastName is required')
        .isString()
        .withMessage('The lastName must be a text string.'),
    check('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('The email must be a valid email address.')
        .normalizeEmail(),
    check('phoneNumber')
        .notEmpty()
        .withMessage('phoneNumber is required')
        .isString()
        .withMessage('The phoneNumber is invalid.'),
    check('role')
        .notEmpty()
        .withMessage('role is required')
        .isString()
        .withMessage('The role must be a text string.'),
    check('status')
        .notEmpty()
        .withMessage('status is required')
        .isString()
        .withMessage('The status must be a text string.'),
    check('street')
        .notEmpty()
        .withMessage('street is required')
        .isString()
        .withMessage('The street must be a text string.'),
    check('number')
        .notEmpty()
        .withMessage('strret number is required')
        .isString()
        .withMessage('The street number must be a text string.'),
    check('city')
        .notEmpty()
        .withMessage('city is required')
        .isString()
        .withMessage('The city must be a text string.'),
    check('postalCode')
        .notEmpty()
        .withMessage('postalCode is required')
        .isString()
        .withMessage('The postalCode must be a text string.'),
    checkRoleExist,
    checkDuplicateEmail,
    (req, res, next) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.array();
            return res.status(400).json({ message: errors[0]?.msg || "Unhandled error" });
        }

        next();
    },
];

const verifySignUp = {
    validateCreation,
    validateUpdate,
};

export default verifySignUp;