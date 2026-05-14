import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Monetra API is running" });
});

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

start();
