'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { skillProb } = require('../seederData/skills');

sports.sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

let skills = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let i = 0; i < sports.length; i++) {
    let sport = sports[i];
    // I'm baffled as to the need for the following line.
    let skillsLength = sport.skills ? JSON.parse(sports[i].skills).length : 3;
    let skill = (Math.random() < skillProb) ? (1 + Math.floor(Math.random() * skillsLength)) : 0;
    let updatedAt = faker.date.past(0.1);
    skill = {userId: iUser + 1, sportId: i + 1, skill, updatedAt, createdAt: faker.date.past(0.1, updatedAt)};
    skills.push(skill);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', skills),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills'),
};
