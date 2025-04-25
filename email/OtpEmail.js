// emails/OTPVerificationEmail.tsx

export default function OtpEmail({ otp }) {
  return `<Html>
      <Heading>Your OTP Code</Heading>
      <Text>Use the following OTP to verify your email:</Text>
      <Text style={{ fontSize: "20px", fontWeight: "bold" }}>${otp}</Text>
      <Text>This OTP will expire in 10 minutes.</Text>
    </Html>`;
}
