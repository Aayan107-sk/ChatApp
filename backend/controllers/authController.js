//send opt 

import { response } from "express";
import User from "../models/userModel";
import otpGenerat from "../utils/otpGenerater";

const sendOtp = async(req,res)=>{
    const {phoneNumber,phoneSuffix,email}=req.body;
    const otp= otpGenerat();
    const expiry= new Date(Date.now()+10*60*1000); //10 minutes from now

    let user ;
    try {
      if(email){
        user= await User.findOne({email});

        if(!user){
          user = new User({email});
        }

        user.emailOtp= otp;
        user.emailOtpExpiry= expiry;
        await user.save();
        return response(res,200,"OTP sent to email",{email});
      }

      if(!phoneNumber || !phoneSuffix){
        return response (res,400,"Phone number and suffix required");
      }
      const fullPhoneNumber=`${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({phoneNumber});
      if(!user){
        user = await new User({phoneNumber,phoneSuffix});
      }
      await user.save();
      
      return response (res,200,"OTP sent to phone number",user);


      
    } catch (error) {
      console.log(error);
      return response(res,500,"Internal server error");
      
      
    }

}