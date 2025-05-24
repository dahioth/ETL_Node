const University = require('./University');
const Domain = require('./Domain');
const WebPage = require('./WebPage');
const { sequelize } = require('../config/database');

// Define relationships
University.hasMany(Domain, {
  foreignKey: 'universityId',
  as: 'domains',
  onDelete: 'CASCADE'
});

University.hasMany(WebPage, {
  foreignKey: 'universityId',
  as: 'web_pages',
  onDelete: 'CASCADE'
});

Domain.belongsTo(University, {
  foreignKey: 'universityId'
});

WebPage.belongsTo(University, {
  foreignKey: 'universityId'
});

module.exports = {
  University,
  Domain,
  WebPage,
  sequelize
}; 