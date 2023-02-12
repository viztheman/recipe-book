let deleteModal;

viewModel.recipes.forEach(x => x.visible = ko.observable(true));

viewModel.selected = ko.observable(viewModel.recipes.length > 0 ? viewModel.recipes[0] : null);
viewModel.recipes = ko.observableArray(viewModel.recipes);
viewModel.recipe = ko.observable(viewModel.recipe);

viewModel.showAddEdit = ko.observable(false);
viewModel.editId = ko.observable(null);
viewModel.title = ko.observable(null);
viewModel.ingredients = ko.observable(null);
viewModel.steps = ko.observable(null);
viewModel.notes = ko.observable(null);
viewModel.search = ko.observable(null);

viewModel.showAdd = ko.pureComputed(function() {
	return viewModel.showAddEdit() && viewModel.editId() !== null;
});

viewModel.showEdit = ko.pureComputed(function() {
	return viewModel.showAddEdit() && viewModel.editId() === null;
});

viewModel.addEditClass = ko.pureComputed(function() {
	return viewModel.showAddEdit() ? 'd-block' : 'd-none';
});

viewModel.headerClass = ko.pureComputed(function() {
	return viewModel.showAddEdit() ? 'invisible' : 'visible';
});

viewModel.editClass = ko.pureComputed(function() {
	return viewModel.recipe() ? 'visible' : 'invisible';
});

viewModel.deleteClass = ko.pureComputed(function() {
	return viewModel.recipe() ? 'visible' : 'invisible';
});

viewModel.recipeClass = ko.pureComputed(function() {
	return viewModel.showAddEdit() ? 'd-none' : 'd-flex';
});

viewModel.addEditLabel = ko.pureComputed(function() {
	return viewModel.editId() ? 'Edit Recipe' : 'Add Recipe';
});

viewModel.changeRecipe = async function() {
	const target = viewModel.recipes().find(x => x.id === this.id);
	if (!target) return;

	const data = await fetch(`/api/recipes/${target.id}`, {
		headers: {'Authorization': 'Bearer ' + viewModel.apiKey}
	});
	if (!data) return;

	const recipe = await data.json();
	viewModel.selected(target);
	viewModel.recipe(recipe);
};

viewModel.addEditRecipe = async function() {
	const id = viewModel.editId();
	const isEdit = !!id;

	const data = {
		title: viewModel.title(),
		ingredients: viewModel.ingredients(),
		steps: viewModel.steps(),
		notes: viewModel.notes()
	};
	if (!data.title || !data.ingredients || !data.steps)
		return;

	const result = await fetch(
		isEdit ? `/api/recipes/${id}` : '/api/recipes',
		{
			method: isEdit ? 'PATCH' : 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + viewModel.apiKey
			},
			body: JSON.stringify(data)
		}
	);

	const recipe = await result.json();
	const replacement = {id: recipe.id, title: recipe.title};

	if (isEdit)
		viewModel.recipes.replace(viewModel.selected(), replacement);
	else 
		viewModel.recipes.push(replacement);

	viewModel.showAddEdit(false);
	await viewModel.changeRecipe.call(replacement);
};

viewModel.showAdd = function() {
	viewModel.editId(null);
	viewModel.title(null);
	viewModel.ingredients(null);
	viewModel.steps(null);
	viewModel.notes(null);
	viewModel.showAddEdit(true);
};

viewModel.showEdit = function() {
	const recipe = viewModel.recipe();
	if (!recipe) return;

	viewModel.editId(recipe.id);
	viewModel.title(recipe.title);
	viewModel.ingredients(recipe.ingredients);
	viewModel.steps(recipe.steps);
	viewModel.notes(recipe.notes);
	viewModel.showAddEdit(true);
};

viewModel.cancelAddEdit = function() {
	viewModel.showAddEdit(false);
};

viewModel.deleteRecipe = async function() {
	let target = viewModel.selected();
	await fetch(`api/recipes/${target.id}`, {method: 'DELETE'});

	const index = viewModel.recipes.indexOf(target);
	viewModel.recipes.remove(target);

	const recipes = viewModel.recipes();
	if (recipes.length > 0) {
		target = index >= recipes.length ? recipes[index - 1] : recipes[index];
		await viewModel.changeRecipe.call(target);
	}
	else {
		viewModel.selected(null);
		viewModel.recipe(null);
	}

	deleteModal.hide();	
};

viewModel.search.subscribe(function(search) {
	const copy = [...viewModel.recipes()];
	copy.forEach(x => x.visible(new RegExp(search, 'i').test(x.title)));
	viewModel.recipes(copy);
});

ko.applyBindings(viewModel);

deleteModal = new bootstrap.Modal('#deleteModal');
