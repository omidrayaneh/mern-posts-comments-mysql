const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    const validToken = verify(accessToken, process.env.SECRET_KEY);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = { validateToken };
