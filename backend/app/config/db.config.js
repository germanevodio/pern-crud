export default {
    HOST: "fullstack-pern-db-1",
    USER: "rootUser",
    PASSWORD: "rootPass",
    DB: "perndatabase",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};