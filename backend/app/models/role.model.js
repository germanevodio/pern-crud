export default (sequelize, DataTypes) => {
    const Role = sequelize.define("roles", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user',
            allowNull: false,
        },
    });

    return Role;
};