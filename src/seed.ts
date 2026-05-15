import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User";

const seedUsers = [
  {
    name: "Admin User",
    email: "admin@monetra.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    name: "Sales Executive",
    email: "sales@monetra.com",
    password: "sales123",
    role: "sales" as const,
  },
  {
    name: "Sanction Executive",
    email: "sanction@monetra.com",
    password: "sanction123",
    role: "sanction" as const,
  },
  {
    name: "Disbursement Executive",
    email: "disbursement@monetra.com",
    password: "disbursement123",
    role: "disbursement" as const,
  },
  {
    name: "Collection Executive",
    email: "collection@monetra.com",
    password: "collection123",
    role: "collection" as const,
  },
  {
    name: "Test Borrower",
    email: "borrower@monetra.com",
    password: "borrower123",
    role: "borrower" as const,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("connected to the dataBase");

    await User.deleteMany({
      email: { $in: seedUsers.map((u) => u.email) },
    });
    console.log("cleared seed users ");

    for (const userData of seedUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      await User.create({ ...userData, password: hashedPassword });
      console.log(`Created: ${userData.role} → ${userData.email}`);
    }
    console.log("\n Seed complete. Login credentials:");
    console.log("─────────────────────────────────────");
    seedUsers.forEach((u) => {
      console.log(`${u.role.padEnd(15)} ${u.email.padEnd(30)} ${u.password}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();
