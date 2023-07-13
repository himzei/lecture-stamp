import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// test
export const getUsersAll = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};

export const loginSuccess = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);
    const userData = await User.findOne({ _id: data.id });
    res.status(200).json({
      ok: "true",
      username: userData.username,
      email: userData.email,
      name: userData.name,
      mobile: userData.mobile,
    });
  } catch (error) {
    res.status(401).json({ ok: "false", message: "unAuthorized" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("accessToken", "", {
      secure: true,
      httpOnly: false,
      sameSite: "None",
    });
    res.cookie("refreshToken", "", {
      secure: true,
      httpOnly: false,
      sameSite: "None",
    });

    res.status(200).json({ ok: "true", message: "로그아웃 성공" });
  } catch (error) {
    res.status(500).json({ ok: "false", error });
  }
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

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(401)
      .json({ ok: "false", message: "해당하는 유저가 없습니다." });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(401)
      .json({ ok: "false", message: "아이디/패스워드가 다릅니다." });
  }
  try {
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: false,
      sameSite: "None",
    });

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: false,
      sameSite: "None",
    });

    res.status(200).json({ ok: "true" });
  } catch (error) {
    res.status(500).json({ ok: "false", error: "에러가 발생하였습니다." });
  }
};
