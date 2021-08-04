'use strict';
const faker = require('faker');

const { numberOfUsers } = require('../seederData/users');
const { gameTypes } = require('../seederData/gameTypes');
const { numberOfGames, cities, skillProb, miscProb } = require('../seederData/games')

const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const games = [];
for (let i = 0; i < numberOfGames; i++) {
  const game = r({
    ownerId: 1 + Math.floor(Math.random() * numberOfUsers),
    address: cities[Math.floor(cities.length * Math.random())],
    dateTime: faker.date.future()
  });
  game.minSkill = (Math.random() < skillProb) ? 1 + Math.floor(Math.random() * 2) : 0;
  game.maxSkill = (Math.random() < skillProb) ? 2 + Math.floor(Math.random() * 2) : 0;
  game.gameTypeId = 1 + Math.floor(Math.random() * gameTypes.length);
  if (Math.random() < miscProb)  game.extraInfo = faker.lorem.words();
  games.push(game);
}

module.exports = {
  // gameTypeId of games'll be needed when seeding Reservations
  games,
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Games', games),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Games')
};