import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    source: { type: String, default: "website" }, // e.g., website, referral
    interest: { type: String, trim: true }, // product/service interested
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "INTERESTED", "QUALIFIED", "CONVERTED", "LOST"],
      default: "NEW",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: [{ text: String, createdAt: { type: Date, default: Date.now }, addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
    isDeleted: { type: Boolean, default: false },
    convertedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null }
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
