const jwt = require("jsonwebtoken");
 
const check_Authentication = (req, res, next) => {
  const { TokenExpiredError } = jwt;
 
  const tokenHeader = req.headers.authorization;
 
  if (!tokenHeader  || !tokenHeader.startsWith("Bearer")) {
    return res.status(403).json({
      error: "Not able to identify the token or token not provided",
    });
  }
 
  const token = tokenHeader.split(" ")[1];
 
  if (!token) {
    return res.status(403).json({
      error: "Not able to identify the token or token not provided",
    });
  }
 
  jwt.verify(token, process.env.SUPERSECRET_KEY, (err, decoded) => {
    if (decoded &&(decoded.role === "employee" || decoded.role === "admin")) {
      next();
    } else {
      return res
      .status(401)
      .json({ message: "Unauthorized! Please login as an employee" });
    }
  });
};
 
module.exports = check_Authentication;