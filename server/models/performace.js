import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  missionCompleted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Missions",
    },
  ],
});

const Performance = mongoose.model("Performance", performanceSchema);
export default Performance;
