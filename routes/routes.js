import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import otpGenerator from "otp-generator";
import bcrypt, { hash } from "bcrypt";

const prisma = new PrismaClient();
const router = Router();

const initiateOtpProcess = async (email, id) => {
  const saltRounds = 10;
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  await sendOtpEmail(email, otp);
  bcrypt.hash(otp, saltRounds, async function (err, hash) {
    // Store hash in your password DB.
    if (hash) {
      await prisma.otpVerification.create({
        data: {
          otp: hash,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          user: {
            connect: { id },
          },
        },
      });
    } else if (err) {
      console.log(err);
    }
  });
};

router.get("/", (req, res) => {
  return res.status(200).json({ message: "perfect connected to backend" });
});
router.post("/sign-up", async (req, res) => {
  console.log("mysq", req.body);
  const { name, email, password, retypePassword } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !retypePassword ||
    password !== retypePassword
  ) {
    return res.status(400).json({
      message:
        "need all the input fields in sigup form with matching passwords",
    });
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser && existingUser.isVerified) {
    return res
      .status(409)
      .json({ message: "user already exists please continue logging in" });
  }

  // const hash = await bcrypt.hash(otp, saltRounds);

  if (existingUser) {
    const userRecord = await prisma.user.findUnique({ where: { email } });
    initiateOtpProcess(email, userRecord.id);

    return res
      .status(403)
      .json({ message: "user already exists but not verified" });
  }

  try {
    const user = await prisma.user.create({
      data: { name, email, password },
      select: { id: true, email: true },
    });
    initiateOtpProcess(user.email, user.id);

    return res.status(201).json({
      message: "Request is successful and user created on server",
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  console.log(req);
  const { otp, email } = req.body;
  console.log("otp is --> ", otp);
  const userRecord = await prisma.user.findUnique({ where: { email } });
  if (!userRecord) {
    return res.status(404).json({ message: "User not found" });
  }

  const record = await prisma.otpVerification.findFirst({
    where: {
      userId: userRecord.id,
      verified: false,
      expiresAt: {
        gt: new Date(), // should not be expired
      },
    },
    orderBy: {
      createdAt: "desc", // need latest otp
    },
  });
  if (!record) {
    res.status(400).json({ message: "OTP expired or not found" });
  }
  const isMatch = await bcrypt.compare(otp, record.otp);
  if (isMatch) {
    await prisma.otpVerification.update({
      where: {
        id: userRecord.id,
      },
      data: {
        verified: true,
      },
    });
    await prisma.user.update({
      where: { id: userRecord.id },
      data: { isVerified: true },
    });
    res.status(200).json({ message: "User verified successfully" });
  } else {
    res.status(400).json({ message: "invalid or expired otp" });
  }
});

export default router;
