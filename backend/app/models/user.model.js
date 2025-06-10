export default (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user',
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
            allowNull: false,
        },
        address: {
            type: DataTypes.JSONB
        },
        profilePicture: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
    });

    return User;
};