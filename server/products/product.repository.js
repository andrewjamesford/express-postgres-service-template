const db = require("../db");

module.exports = {
	getProducts: async (sortOrder, direction) => {
		try {
			let sortOrderParam = "p.id";

			if (sortOrder.toLowerCase() === "name") {
				sortOrderParam = "p.name";
			}
			if (sortOrder.toLowerCase() === "description") {
				sortOrderParam = "p.description";
			}
			if (sortOrder.toLowerCase() === "price") {
				sortOrderParam = "p.price";
			}
			if (sortOrder.toLowerCase() === "discountamount") {
				sortOrderParam = "p.discount_amount";
			}

			if (direction.toLowerCase() === "desc") {
				sortOrderParam = `${sortOrderParam} DESC`;
			}

			const result = await db.query(
				`SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        pc.name AS "categoryName",
        pi.name AS "imageName",
        pi.description AS "imageDescription",
        pd.discount_type_id AS "discountGroup",
        pd.value AS "discountValue",
        dt.type AS "discountType"
      FROM product p
      LEFT JOIN product_category pc ON p.product_category_id = pc.id
      LEFT JOIN product_image pi ON p.product_image_id = pi.id
      LEFT JOIN product_discount pd ON p.id = pd.product_id
      LEFT JOIN discount_type dt ON pd.discount_type_id = dt.id
        ORDER BY ${sortOrderParam}`,
			);
			return result.rows;
		} catch (error) {
			throw Error(error);
		}
	},
};
