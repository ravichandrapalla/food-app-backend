import { Resend } from "resend";
import OTPEmail from "../email/OtpEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to, otp) {
  try {
    const data = await resend.emails.send({
      from: "Your App <noreply@yourdomain.com>", // Must be a verified domain
      to,
      subject: "Your OTP Code",
      react: OTPEmail({ otp }),
    });

    console.log("Email sent!", data);
    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}
