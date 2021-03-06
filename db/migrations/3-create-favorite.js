'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Favorites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Skill: {allowNull: true, type: Sequelize.INTEGER},
      ...[['userId', 'Users'], ['sportId', "Sports"]].reduce((pojo, fk) => {
        return {...pojo, [fk[0]]: {
          allowNull: false,
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {model: `${fk[1]}`}
        }}
      }, {}),
      ...['createdAt', 'updatedAt'].reduce((pojo, date) => {
        return {...pojo, [date]: {type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}};
      }, {}),
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Favorites')
};
