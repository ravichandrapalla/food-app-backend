import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
const router = Router();

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
  if (existingUser) {
    return res.status(409).json({ message: "user already exists" });
  }

  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    return res.status(201).json({
      message: "Request is successful and user created on server",
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
