import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      ok: true,
      username: userData.username,
      email: userData.email,
      name: userData.name,
      mobile: userData.mobile,
      missions: userData.missionCompleted,
      id: userData._id,
    });
  } catch (error) {
    res.status(401).json({ ok: false, message: "unAuthorized" });
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

// 카카오 싱크 간편가입
export const kakaoAsyncRegister = async (req, res) => {
  const data = req.query;
  res.json({ data });
};

export const postEditMissions = async (req, res) => {
  try {
    const {
      body: { missionId, userId },
    } = req;
    const mission = missionId.trim();
    const updatedUser = await User.findByIdAndUpdate(userId, {
      missionCompleted: mission,
    });
    res.status(200).json({ ok: "true", updatedUser });
  } catch (error) {
    res.status(500).json({ ok: "false", error });
  }
};

export const kakaoLogin = async (req, res) => {
  try {
    const KAKAO_BASE_PATH = "https://kauth.kakao.com/oauth/token";
    const config = {
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_CLIENT,
      code: req.body.code,
      redirect_uri: process.env.REDIRECT_URI,
    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${KAKAO_BASE_PATH}?${params}`;
    console.log(finalUrl);

    const data = await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    const tokenRequest = await data.json();

    console.log(tokenRequest);

    // if ("access_token" in tokenRequest) {
    //   const { access_token } = tokenRequest;
    //   const userRequest = await fetch("https://kapi.kakao.com/v2/user/me", {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //       Authorization: `Bearer ${access_token}`,
    //     },
    //   });
    //   const userData = await userRequest.json();

    //   console.log(userData);
    // }
  } catch (error) {
    console.log(error);
  }
};
