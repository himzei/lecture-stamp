import Performance from "../models/performace.js";
import User from "../models/user.js";

export const postPerformance = async (req, res) => {
  const {
    body: { instaUrl },
    session: {
      user: { _id },
      companyId,
      missionInstagram,
    },
  } = req;
  try {
    const performance = await Performance.findOneAndUpdate(
      { user: _id, companyId },
      {
        $set: {
          user: _id,
          companyId,
          instaUrl,
          missionCompleted: missionInstagram,
          createdAt: Date.now(),
        },
      },
      { upsert: true }
    );
    await User.findByIdAndUpdate(_id, {
      $push: { missionCompleted: missionInstagram },
    });
    res.status(200).json({ ok: "true", performance });
  } catch (error) {
    res.status(500).json({ ok: "false", message: "에러가 발생", error });
    console.log(error);
  }
};
