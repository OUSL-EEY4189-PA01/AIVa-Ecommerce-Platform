import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = { userId: user._id };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export default generateToken;
