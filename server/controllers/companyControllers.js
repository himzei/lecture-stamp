import Company from "../models/company.js";
import Missions from "../models/missions.js";

export const postRegister = async (req, res) => {
  const { name, eventName, eventDescription, instagramHashtags } = req.body;

  try {
    const company = await Company.create({
      name,
      eventName,
      eventDescription,
      instagramHashtags,
      createdAt: Date.now(),
    });
    res.status(200).json({ ok: "true", company });
  } catch (error) {
    res.status(500).json({ ok: "false", message: "에러가 발생", error });
  }
};

export const getCompany = async (req, res) => {
  const Uid = req.query.Uid;
  try {
    const company = await Company.findOne({ _id: Uid }).populate({
      path: "missions",
      options: {
        sort: { order: 1 },
      },
    });
    // .aggregate([{ $sort: { order: 1 } }]);
    const { missions } = company;
    const missionKakao = missions.find(
      (mission) => mission.reference === "kakaoTalkSync"
    );
    const missionInstagram = missions.find(
      (mission) => mission.reference === "missionInstagram"
    );
    req.session.missionKakaoId = missionKakao._id;
    req.session.missionInstagram = missionInstagram._id;
    req.session.companyId = Uid;

    res.status(200).json({ ok: "true", company });
  } catch (error) {
    res.status(500).json({ ok: "false", message: "에러가 발생", error });
  }
};

export const postMission = async (req, res) => {
  const { title, sub, imgSrc, href, companyUid } = req.body;
  try {
    const mission = await Missions.create({
      title,
      sub,
      imgSrc,
      href,
      company: companyUid,
      createdAt: Date.now(),
    });
    res.status(200).json({ ok: "true", mission });
  } catch (error) {
    res.status(500).json({ ok: "false", message: "에러가 발생", error });
  }
};
