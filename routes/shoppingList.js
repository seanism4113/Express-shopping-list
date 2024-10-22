const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

// GET all items
router.get("/", (req, res) => {
	res.json(items);
});

// POST a new item
router.post("/", (req, res, next) => {
	try {
		const { name, price } = req.body;
		if (!name || price === undefined) {
			throw new ExpressError("Name and price are required", 400);
		}
		const newItem = { name, price };
		items.push(newItem);
		return res.status(201).json({ added: newItem });
	} catch (e) {
		return next(e);
	}
});

// GET a specific item by name
router.get("/:name", (req, res, next) => {
	try {
		const foundItem = items.find((item) => item.name === req.params.name);
		if (!foundItem) {
			throw new ExpressError("Item not found", 404);
		}
		res.json(foundItem);
	} catch (e) {
		next(e);
	}
});

// Update a specific item by name
router.patch("/:name", (req, res, next) => {
	try {
		const foundItem = items.find((item) => item.name === req.params.name);
		if (!foundItem) {
			throw new ExpressError("Item not found", 404);
		}
		const { name, price } = req.body;
		if (name) foundItem.name = name;
		if (price !== undefined) foundItem.price = price;
		res.json({ updated: foundItem });
	} catch (e) {
		next(e);
	}
});

// Delete a specific item by name
router.delete("/:name", (req, res, next) => {
	try {
		const itemIndex = items.findIndex((item) => item.name === req.params.name);
		if (itemIndex === -1) {
			throw new ExpressError("Item not found", 404);
		}
		items.splice(itemIndex, 1);
		res.json({ message: "Deleted" });
	} catch (e) {
		next(e);
	}
});

module.exports = router;
