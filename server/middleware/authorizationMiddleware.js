const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
	audience: `${process.env.AUTH0_AUDIENCE}`,
	issuerBaseURL: `${process.env.AUTH0_ISSUER_BASE_URL}`,
	tokenSigningAlg: "RS256",
});

const checkScopes = requiredScopes(`${process.env.AUTH0_SCOPE}`);

module.exports = {
	checkJwt,
	checkScopes,
};
