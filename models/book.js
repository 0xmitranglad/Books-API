module.exports = (sequelize, DataTypes) => {
    return sequelize.define('book', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publisher: {
            type: DataTypes.STRING,
            allowNull: false
        },
        edition: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publishYear: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
};