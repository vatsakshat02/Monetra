import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import borrowerRoutes from "./routes/borrower.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Monetra API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/borrower", borrowerRoutes);
app.use("/api/dashboards", dashboardRoutes);

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

start();
