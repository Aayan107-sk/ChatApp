import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import e from 'express';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { 
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


transporter.verify((error, success) => {
    if (error) {
        console.log('Error with email transporter: ', error);  
    }else {
        console.log('Email transporter is ready to send messages');
    }     
});
export const sendOtpToEmail = async (email, otp) => {
  const html=`<h1>Your OTP Code</h1>
  <p>Your OTP code is: <strong>${otp}</strong></p>
  <p>This code will expire in 10 minutes.</p>
  `;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: html
    };
    await transporter.sendMail(mailOptions);
}

