const bcrypt = require('bcrypt');
const _ = require('underscore');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

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
    author.prototype.toAbstractJSON = function() {
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
    }

    author.prototype.generateToken = function(type) {
        if(!_.isString(type)) {
            return undefined;
        }

        try {
            let stringData = JSON.stringify({id: this.get('id'), type: type});
            let encryptedData = cryptojs.AES.encrypt(stringData, 'abc1234').toString();
            let token = jwt.sign({
                token: encryptedData
            }, 'qwerty098');

            return token;
        } catch (e) {
            return undefined;
        }
    }

    //classMethods
    author.authenticate = (body) => {
        return new Promise((resolve, reject) => {
            if(typeof body.email !== 'string' && typeof body.password !== 'string') {
                return reject();
            }
        
            author.findOne({
                where: { email: body.email }
            }).then((author) => {
                if(!author || !bcrypt.compareSync(body.password, author.get('passwordHash'))) {
                    return reject();
                }

                resolve(author);
            }, (err) => {
                reject();
            });
        });
    }

    author.findByToken = (token) => {
        return new Promise((resolve, reject) => {
            try {
                let decodedJWT = jwt.verify(token, 'qwerty098');
                let bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc1234');
                let tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

                author.findByPk(tokenData.id).then((author) => {
                    if(author) {
                        resolve(author);
                    } else {
                        reject();
                    }
                }, (err) => {
                    reject();
                });
            } catch (err) {
                reject();
            }
        });
    }

    return author;
};