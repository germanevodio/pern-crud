import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";
import UserModel from "./user.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = UserModel(sequelize, Sequelize);

db.ROLES = ["user", "admin"];

export default db;