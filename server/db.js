const { Pool } = require("pg");
const types = require("pg").types;
// pg won't cast by default as may lose precision.
types.setTypeParser(1700, (val) => Number.parseFloat(val));

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production",
});

module.exports = {
	query: (text, params, callback) => {
		return pool.query(text, params, callback);
	},
	end: () => {
		pool.end();
	},
};
