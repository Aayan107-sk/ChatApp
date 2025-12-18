//send opt


import User from "../models/userModel.js";
import otpGenerat from "../utils/otpGenerater.js";
import { sendOtpToEmail } from "../services/emailService.js";
import { sendOtpToPhoneNumber } from "../services/twilloService.js";
import { generateToken } from "../utils/generateToken.js";
import response from "../utils/responseHandler.js";
import { verifyPhoneOtp } from "../services/twilloService.js";

export const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;
  const otp = otpGenerat();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); //10 minutes from now

  let user;
  try {
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        user = new User({ email });
      }

      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;
      await user.save();
      await sendOtpToEmail(email, otp);
      return response(res, 200, "OTP sent to email", { email });
    }

    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Phone number and suffix required");
    }
    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await new User({ phoneNumber, phoneSuffix });
    }
    await sendOtpToPhoneNumber(fullPhoneNumber);
    await user.save();

    return response(res, 200, "OTP sent to phone number", user);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error");
  }
};

// step two verify otp

export const verifyOtp = async (req, res) => {
  const {phoneNumber, phoneSuffix, email,otp } = req.body;

  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return response(res, 404, "User not found");
      }

      const now = new Date();
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      ) {
        return response(res, 400, "invalid or expired otp");
      }
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    } else {
      if (!phoneNumber || !phoneSuffix) {
        return response(res, 400, "Phone number and suffix required");
      }
      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber });
      if (!user) {
        return response(res, 404, "User not found");
      }

      const result = await verifyPhoneOtp(fullPhoneNumber, otp);
      if (result.status !== "approved") {
        return response(res, 400, "invalid Otp");
      }
      user.isVerified = true;
      await user.save();
    }
    const token=generateToken(user?._id);
    res.cookie("auth_token",token,{
      httpOnly:true,
      maxAge:1000*60*60*24*365
    })

    return response(res,200,"otp verifyed successfully",{token,user})
  } catch (error) {
        console.log(error);
        return response(res, 500, "Internal server error");
  }
};
