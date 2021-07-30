'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Reservations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      extraInfo: {type: Sequelize.TEXT},
      ...[['playerId', 'Users'], ['gameId', "Games"]].reduce((pojo, fk) => {
        return {...pojo, [fk[0]]: {
          allowNull: false,
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {model: `${fk[1]}`}
        }}
      }, {}),
      ...['setter','middle','rightSide','outside','libero','twos','fours','sixes'].reduce((pojo, bool)=>{
        return {...pojo, [bool]: {type: Sequelize.BOOLEAN, defaultValue: false}};
      }, {}),
      ...['createdAt', 'updatedAt'].reduce((pojo, date) => {
        return {...pojo, [date]: {type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}};
      }, {}),
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Reservations')
};
