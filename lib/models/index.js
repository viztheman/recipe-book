const {SQLITE} = process.env;

const {Sequelize, DataTypes} = require('sequelize');

console.log(SQLITE);
const sequelize = new Sequelize('sqlite:' + SQLITE);

const Recipe = sequelize.define('Recipe', {
	title: DataTypes.STRING,
	ingredients: DataTypes.STRING,
	steps: DataTypes.STRING,
	notes: DataTypes.STRING
});

sequelize.sync();
module.exports = {Recipe};
