import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
  mission1: { type: Boolean, default: false },
  mission2: { type: Boolean, default: false },
  mission3: { type: Boolean, default: false },
  mission4: { type: Boolean, default: false },
  mission5: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date,
  userIndex: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Missions = mongoose.model("Missions", missionSchema);
export default Missions;
