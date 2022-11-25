const express = require('express');
const {Recipe} = require('../../models');

const router = express.Router();

router.get('/', async (req, res) => {
	let recipe = null;

	const recipes = await Recipe.findAll({attributes: ['id', 'title']});

	if (recipes.length > 0)
		recipe = await Recipe.findByPk(recipes[0].id);

	res.render('root', {context: {recipes, recipe}});
});

module.exports = router;
