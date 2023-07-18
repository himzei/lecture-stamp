import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  eventName: { type: String },
  eventDescription: { type: String },
  instagramHashtags: { type: String },
  createdAd: Date,

  missions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Missions",
      required: false,
    },
  ],
});

const Company = mongoose.model("Company", companySchema);
export default Company;
