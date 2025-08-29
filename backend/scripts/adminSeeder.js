// scripts/adminSeeder.js
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminName = process.env.ADMIN_NAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }

  const hashedPassword = await bcryptjs.hash(adminPassword, 10);

  await User.create({
    email: adminEmail,
    name: adminName,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin seeded successfully.");
  process.exit();
};

seedAdmin().catch((err) => {
  console.error("Admin seeding failed:", err);
  process.exit(1);
});
