module.exports = (sequelize, DataTypes) => {
    var author = sequelize.define('author', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [7, 100]
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        hooks: {
            beforeValidate: () => {
                if(typeof author.email === 'string') {
                    author.email = author.email.toLowerCase();
                }
            }
        }
    });
    return author;
};
