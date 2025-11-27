import twilio from 'twilio';

//create twillo client
const accountSid = process.env.TWILLO_ACCOUNT_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
const serviseSid = process.env.TWILLO_SERVICE_SID;


const client = twilio(accountSid, authToken);

// send otp  to phone number

export const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log("sendind otp  to  this number ",phoneNumber);
    if(!phoneNumber){
      throw new Error("Phone number is required");
    }
    const response = await client.verify.v2.services(serviseSid).verifications.create({
      to: phoneNumber,
      channel: 'sms'
    });

    console.log("this is my otp resopnse",response);
    
    return response;
    
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error(error);
    
  }
}


// verify phone number otp

export const verifyOtp = async (phoneNumber,otp) => {
  try {
    console.log("this is my otp and phone number ",otp,phoneNumber);
    
 
    const response = await client.verify.v2.services(serviseSid).verificationChecks.create({
      to: phoneNumber,
      code: otp
    });

    console.log("this is my otp resopnse",response);
    
    return response;
    
  } catch (error) {
    console.error(" OTP verificationChecks  failed:", error);
    throw new Error(error);
    
  }
}

