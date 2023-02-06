const express = require('express');
const {Recipe} = require('../../models');

const router = express.Router();

router.get('/recipes', async (req, res) => {
	let recipes;

	try {
		recipes = await Recipe.findAll();
	}
	catch (e) {
		console.error(e);
		next(e);
	}

	res.json({recipes});
});

router.get('/recipes/:id', async (req, res) => {
	let recipe;

	try {
		recipe = await Recipe.findByPk(req.params.id);
	}
	catch (e) {
		console.error(e);
		next(e);
	}

	if (!recipe)
		return res.status(404).end();

	res.json(recipe);
});

router.post('/recipes', express.json(), async (req, res) => {
	const {title, ingredients, steps, notes} = req.body;

	if (!title || !ingredients || !steps)
		return res.status(400).end();

	let recipe;
	try {
		recipe = await Recipe.create({title, ingredients, steps, notes});
	}
	catch (e) {
		console.error(e);
		return res.status(400).end();
	}

	res.status(201).json(recipe);
});

router.patch('/recipes/:id', express.json(), async (req, res) => {
	const {title, ingredients, steps, notes} = req.body;

	if (!title || !ingredients || !steps)
		return res.status(400).end();

	try {
		await Recipe.update(
			{title, ingredients, steps, notes},
			{where: {id: req.params.id}}
		);
	}
	catch (e) {
		console.error(e);
		return res.status(400).end();
	}

	res.status(201).json({id: req.params.id, title, ingredients, steps});
});

router.delete('/recipes/:id', async (req, res) => {
	try {
		await Recipe.destroy({where: {id: req.params.id}});
	}
	catch (e) {
		console.error(e);
		next();
	}

	res.status(204).end();
});

module.exports = router;
