process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const items = require("../fakeDb");

let item = { name: "chocolate", price: 3.55 };

beforeEach(function () {
	items.push(item);
});

afterEach(function () {
	items.length = 0;
});

describe("GET /items", () => {
	test("Get all items", async () => {
		const res = await request(app).get("/items");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(items);
	});
});

describe("POST /items", () => {
	test("Create a new item", async () => {
		const newItem = { name: "soda", price: 1.99 };
		const res = await request(app).post("/items").send(newItem);
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ added: newItem });
	});
	test("Responds with 400 if name is missing", async () => {
		const res = await request(app).post("/items").send({});
		expect(res.statusCode).toBe(400);
	});
});

describe("GET /items/:name", () => {
	test("Get item by name", async () => {
		const res = await request(app).get(`/items/${item.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(item);
	});
	test("Responds with 404 for item that does not exist", async () => {
		const res = await request(app).get("/items/chicken");
		expect(res.statusCode).toBe(404);
	});
});

describe("/PATCH /items/:name", () => {
	test("Updating a item's name", async () => {
		const res = await request(app).patch(`/items/${item.name}`).send({ name: "eggs" });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ updated: { name: "eggs", price: 3.55 } });
	});
	test("Updating a item's price", async () => {
		const res = await request(app).patch(`/items/${item.name}`).send({ price: 5.55 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ updated: { name: "eggs", price: 5.55 } });
	});
	test("Responds with 404 for invalid name", async () => {
		const res = await request(app).patch(`/items/chicken`).send({ name: "eggs" });
		expect(res.statusCode).toBe(404);
	});
});

describe("/DELETE /items/:name", () => {
	test("Deleting a item", async () => {
		const res = await request(app).delete(`/items/${item.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: "Deleted" });
	});
	test("Deleting item that does not exist", async () => {
		const res = await request(app).delete(`/items/chicken`);
		expect(res.statusCode).toBe(404);
	});
});
