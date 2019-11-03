const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (request, response, next) => {
  // Get header token
  const token = request.header("x-auth-token");

  // If no token
  if (!token) {
    return response
      .status(401)
      .json({ msg: "No Token , Authorization Failure !" });
  } else {
    try {
      // Verify token
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      request.user = decoded.user;
      next();
    } catch (error) {
      // Malformed token
      return response
        .status(401)
        .json({ msg: "Invalid Token, Authorization Failure" });
    }
  }
};
