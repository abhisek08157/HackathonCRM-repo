import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";


const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// connect DB
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);


// health
app.get("/", (req, res) => res.send("✅ AI CRM Backend Running..."));

// simple error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});


export default app;
