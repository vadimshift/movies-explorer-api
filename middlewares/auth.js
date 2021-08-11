const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const { UnauthorizedError } = require("./errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходимо авторизоваться");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    throw new UnauthorizedError("Необходимо авторизоваться");
  }

  req.user = payload;
  return next();
};
