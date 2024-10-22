const express = require("express");
const app = express();
const ExpressError = require("./expressError");
const shoppingList = require("./routes/shoppingList");

app.use(express.json());
app.use("/items", shoppingList);

// 404 Handler Middlewear
app.use((req, res, next) => {
	next(new ExpressError("Not found", 404));
});

// General Error-Handling MiddleWear
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		error: err.message || "Internal Server Error",
	});
});

module.exports = app;
