const User = require("../model/userModel");

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ msg: "please fill all the details" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: "user not found" });
  }

  return res.status(200).json({
    name: user.name,
    email: user.email,
  });
};

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(404).json({ msg: "please fill all the details" });
  }

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    return res.status(400).json({ msg: "user already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return res.status(200).json(user);
};

module.exports = { userLogin, userRegister };
