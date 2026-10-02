import jwt from "jsonwebtoken";

const auth = (request, response, next) => {
  const token = request.header("x-auth-token");

  if (!token) {
    return response.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded.user;
    next();
  } catch (error) {
    response.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
