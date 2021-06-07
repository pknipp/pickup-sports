'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
        // validates: {
        //   isEmail: true,
        //   len: [3, 255],
        // },
      },
      nickName: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
        // validates: {
        //   isEmail: true,
        //   len: [3, 255],
        // },
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      cell: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      skill: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      photo: {
        type: DataTypes.TEXT,
      },
      tokenId: {
        type: DataTypes.STRING
      },
      hashedPassword: {
        allowNull: false,
        type: DataTypes.STRING.BINARY,
        validates: {
          len: [60, 60],
        },
      },
    },
    {
      defaultScope: {
        attributes: {
//          exclude: ["hashedPassword", "createdAt", "updatedAt"],
          exclude: ["updatedAt"],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] },
        },
        loginUser: {
          attributes: {},
        },
      },
    }
  );

  User.associate = function(models) {};

  User.prototype.toSafeObject = function () {
    return ["createdAt", "email", "firstName", "lastName", "nickName", "photo", "cell", "skill", "id"].reduce((pojo, key) => {
      return {...pojo, [key]: this[key]}
    }, {});
  }

  User.login = async function({ email, password }) {
    const user = await User.scope('loginUser').findOne({where: [{ email }]});
    if (user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  // Do we ever use the following?
  User.signup = async function({ firstName, lastName, optStuff, email, wantsEmail, password }) {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({email, hashedPassword});
    return await User.scope("currentUser").findByPk(user.id);
  };

  User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  User.prototype.isValid = () => true;

  User.prototype.setPassword = function (password) {
    this.hashedPassword = bcrypt.hashSync(password);
    return this;
  };

  User.prototype.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  User.getCurrentUserById = async function(id) {
    return await User.scope("currentUser").findByPk(id);
  };

  return User;
};
