const bcrypt = require('bcrypt');
const _ = require('underscore');

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
        salt: {
            type: DataTypes.STRING,
        },
        passwordHash: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set(value) {
                let salt = bcrypt.genSaltSync(10);
                let hashedPass = bcrypt.hashSync(value, salt);
                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('passwordHash', hashedPass);
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
            beforeValidate: (author, options) => {
                if(typeof author.email === 'string') {
                    author.email = author.email.toLowerCase();
                }
            }
        }
    });

    //instance methods
    author.prototype.toAbstractJSON = function () {
        console.log('inside instance methos');
                let json = this.toJSON();
                return _.pick(
                    json, 
                    'firstName', 
                    'lastName', 
                    'username',
                    'email',
                    'city',
                    'country'
                );
    };

    return author;
};
