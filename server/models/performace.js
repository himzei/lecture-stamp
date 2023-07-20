import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  missionCompleted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Missions",
    },
  ],
  instaUrl: { type: String },
});

const Performance = mongoose.model("Performance", performanceSchema);
export default Performance;
