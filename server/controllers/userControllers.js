import User from "../models/user.js";
import bcrypt from "bcrypt";
import { SolapiMessageService } from "solapi";

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY,
  process.env.SOLAPI_SECRET_KEY
);

const msssageSend = (tel, name) => {
  messageService.send({
    to: tel,
    from: "01071860119",
    kakaoOptions: {
      pfId: "KA01PF230329052246587htCxbWQq2P1",
      templateId: "KA01TP230329070149638ka9toTFP1Hn",
      // 치환문구가 없을 때의 기본 형태
      variables: {
        "#{name}": name,
        "#{type}": "스탬프투어",
        "#{urlManila}": "iwon-philippines.netlify.app",
        "#{urlCebu}": "iwon-cebu.netlify.app",
        "#{urlCebuMonth}": "iwon-cebu-month.netlify.app",
        "#{urlDal}": "iwon-tarlac.netlify.app",
        "#{urlBagio}": "iwon-baguio.netlify.app/",
      },
      disableSms: true,
    },
  });
};

export const getUsersAll = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};

export const loginSuccess = async (req, res) => {
  try {
    const userData = req.session.user;
    const id = userData?._id;
    const loggedInUser = await User.findById(id);
    const { username, email, mobile, name, _id, missionCompleted } =
      loggedInUser;

    res.status(200).json({
      ok: true,
      username,
      email,
      name,
      mobile,
      missions: missionCompleted,
      id: _id,
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
    req.session.user = user;

    res.status(200).json({ ok: "true", user });
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
    const existing = await User.findOne({
      _id: userId,
      missionCompleted: { $in: [mission] },
    });

    if (existing) {
      return json({
        ok: "toast",
        message: "이미 미션 완료한 QR크드입니다.",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { missionCompleted: mission },
    });
    const name = updatedUser.name;
    const tel = updatedUser.mobile;
    const completed = updatedUser.missionCompleted.filter((mission) => mission);
    console.log(tel, name);
    if (completed.length >= 3) {
      msssageSend(tel, name);
    }

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
    // console.log(finalUrl);

    const data = await fetch(finalUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const tokenRequest = await data.json();

    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;
      const userRequest = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      });
      const userData = await userRequest.json();

      const {
        kakao_account: {
          profile: { thumbnail_image_url },
          name,
          email,
          phone_number,
          birthyear,
          gender,
        },
      } = userData;
      const phone = phone_number.replace(/[^\d]/g, "");
      const modifiedNumber = "0" + phone.toString().substring(2);
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        req.session.user = existingUser;
        return res.status(200).json({ ok: "true" });
      } else {
        const user = await User.create({
          name,
          username: email.split("@")[0],
          email,
          mobile: modifiedNumber,
          gender,
          birthyear,
          avatarUrl: thumbnail_image_url,
          missionCompleted: req.session.missionKakaoId,
        });
        req.session.user = user;
        return res.status(200).json({ ok: "true", user });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ ok: "false" });
  }
};
