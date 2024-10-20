import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  // jwt được set trong cookie để tránh việc lưu trữ trong localStorage
  // với việc lưu trữ trong localStorage, nếu có một lỗ hổng XSS, attacker có thể lấy được token và thực hiện các hành vi độc hại
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;