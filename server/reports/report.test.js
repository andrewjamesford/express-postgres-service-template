const request = require("supertest");
jest.mock("../middleware/authorizationMiddleware");
const {
	checkJwt,
	checkScopes,
} = require("../middleware/authorizationMiddleware");
const app = require("../app");
const db = require("../db");
const reportRepository = require("./report.repository");

describe("GIVEN that the GET /reports route exists", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	afterAll(() => {
		db.end();
	});

	test("WHEN the user is not authenticated THEN return status 401", async () => {
		checkJwt.mockImplementation((req, res, next) => {
			try {
				const error = new Error("Unauthenticated");
				error.status = 401;
				throw error;
			} catch (e) {
				next(e);
			}
		});

		const response = await request(app)
			.get("/api/reports")
			.set("Accept", "application/json");

		expect(response.status).toBe(401);
	});

	test("WHEN the user is authenticated but does not have the right permissions THEN return status 403", async () => {
		checkJwt.mockImplementation((req, res, next) => next());
		checkScopes.mockImplementation((req, res, next) => {
			try {
				const error = new Error("Unauthorized");
				error.status = 403;
				throw error;
			} catch (e) {
				next(e);
			}
		});

		const response = await request(app)
			.get("/api/reports")
			.set("Accept", "application/json");

		expect(response.status).toBe(403);
	});

	test("WHEN the user is authenticated THEN return status 200", async () => {
		checkJwt.mockImplementation((req, res, next) => next());
		checkScopes.mockImplementation((req, res, next) => next());

		const mockCategoryReport = [{ id: 1, name: "Category 1" }];
		const mockDiscountReport = [{ id: 1, discount: "10%" }];
		jest
			.spyOn(reportRepository, "getCategoryReport")
			.mockResolvedValue(mockCategoryReport);
		jest
			.spyOn(reportRepository, "getDiscountReport")
			.mockResolvedValue(mockDiscountReport);

		const response = await request(app)
			.get("/api/reports")
			.set("Accept", "application/json");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			categoryReport: [{ id: 1, name: "Category 1" }],
			discountReport: [{ id: 1, discount: "10%" }],
		});
	});

	test.todo("WHEN the user is authenticated THEN return status 200");
});
