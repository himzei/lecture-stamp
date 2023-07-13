import User from "../models/user.js";

export const getUsersAll = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};

export const postJoin = async (req, res) => {
  const { username, password, email, mobile, name } = req.body;

  try {
    await User.create({
      username,
      password,
      mobile,
      email,
      name,
      createdAt: Date.now(),
    });
    res.json({ ok: "true" });
  } catch (error) {
    res.status(500).json({ ok: "false", error: "에러가 발생하였습니다." });
  }
};
