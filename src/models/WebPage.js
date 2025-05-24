const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WebPage = sequelize.define('WebPage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  universityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Universities',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = WebPage; 