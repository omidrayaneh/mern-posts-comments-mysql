const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match)
      return res.json({ error: "Wrong Username And Password Combination" });

    const token = JWT.sign(
      { username: user.username, id: user.id },
      process.env.SECRET_KEY
    );

     res.status(200).json(token);
  });
});
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user)
});
module.exports = router;
