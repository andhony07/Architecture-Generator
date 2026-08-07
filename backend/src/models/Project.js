import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    projectType: {
      type: String,
      default: "Web Application",
    },

    expectedScale: {
      type: String,
      default: "Standard Scale",
    },

    preferredCloud: {
      type: String,
      default: "No Preference",
    },

    preferredDatabase: {
      type: String,
      default: "No Preference",
    },

    constraints: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Generated", "Failed"],
      default: "Generated",
    },

    architecture: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    aiMetadata: {
      provider: { type: String, default: "gemini" },
      model: { type: String, default: "gemini-2.5-flash" },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);