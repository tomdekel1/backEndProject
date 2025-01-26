const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config/config");
module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(400).send("no token provided");
  }
  try {
    const decodedToken = jwt.verify(token, jwtKey);
    req.user = decodedToken;
    next();
  } catch {
    res.status(400).send("invalid token");
  }
};
