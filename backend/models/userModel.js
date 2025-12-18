import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // allows null
    },

    phoneSuffix: {
      type: String,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true,
      validate: {
        validator: function (v) {
          return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    emailOtp: {
      type: String,
    },

    emailOtpExpiry: {
      type: Date,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "Hey there! I am using ChatApp.",
    },

    lastSeen: {
      type: Date,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    agreed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
