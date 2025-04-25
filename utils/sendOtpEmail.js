import { Resend } from "resend";
import OtpEmail from "../email/OtpEmail.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to, otp) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // Must be a verified domain
      to: "ravichandrapalla1997@gmail.com",
      subject: "Your OTP Code",
      html: OtpEmail({ otp }),
    });

    console.log("Email sent!", data);
    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

// import { Resend } from "resend";

// const resend = new Resend("re_Di8YWjaX_6NDkSidZ67ar21G4tDGCs5sV");

// resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: "cravi6635@gmail.com",
//   subject: "Hello World",
//   html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
// });
