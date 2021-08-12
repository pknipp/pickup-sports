'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    "Game",
    {
      ownerId: {allowNull: false, type: DataTypes.INTEGER},
      gameTypeId: {allowNull: false, type: DataTypes.INTEGER},
      ...['Minimum skill', 'Maximum skill'].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: DataTypes.INTEGER}});
      }, {}),
      Location: {allowNull: false, type: DataTypes.TEXT},
      ["Extra info"]: {allowNull: true, type: DataTypes.TEXT},
      dateTime: {allowNull: false, type: DataTypes.DATE}
    },
  );

  Game.associate = function(models) {
    Game.hasMany(models.Reservation, {foreignKey: 'gameId'});
    Game.belongsTo(models.User, {foreignKey: 'ownerId', onDelete: 'CASCADE'});
    Game.belongsTo(models.GameType, {foreignKey: 'gameTypeId', onDelete: 'CASCADE'});
  };

  return Game;
};
