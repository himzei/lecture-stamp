import User from "../models/user.js";

export const getUsersAll = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};
