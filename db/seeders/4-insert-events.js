'use strict';
const faker = require('faker');

const { favorites } = require('./3-insert-favorites');
const { sports } = require('../seederData/sports');
const { numberOfEvents, cities, miscProb, extraInfos } = require('../seederData/events')

const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const events = [];
for (let i = 0; i < numberOfEvents; i++) {
  let favoriteId = Math.floor(favorites.length * Math.random());
  let favorite = favorites[favoriteId];
  let nSkills = sports[favorite.sportId - 1]?.Skills?.length || 4;
  let minSkill = Math.floor(Math.random() * nSkills);
  const event = r({
    favoriteId: 1 + favoriteId,
    ['Location']: cities[Math.floor(cities.length * Math.random())],
    dateTime: faker.date.future(),
    ['Minimum skill']: minSkill,
    ['Maximum skill']: minSkill + Math.floor(Math.random() * (nSkills - minSkill)),
  });
  if (Math.random() < miscProb)  event['Extra info'] = extraInfos[Math.floor(Math.random() * extraInfos.length)];
  events.push(event);
}

module.exports = {
  // sportId of events'll be needed when seeding Reservations
  events,
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Events', events),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Events')
};
