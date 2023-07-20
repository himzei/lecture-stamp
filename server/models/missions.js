import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
  title: { type: String },
  sub: { type: String },
  imgSrc: { type: String },
  href: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  order: { type: Number, required: true },
  reference: { type: String },
  createdAt: Date,
  updatedAt: Date,
});

const Missions = mongoose.model("Missions", missionSchema);
export default Missions;
