import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
// Import your routes here
import adminAuthRouter from "./routes/adminAuth.routes";
import hrAuthRouter from "./routes/hrAuth.routes";
import adminRouter from "./routes/admin.routes";
import jobRouter from "./routes/job.routes";
import candidateRouter from "./routes/candidate.routes";
import hrRouter from "./routes/hr.routes";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is up and running 😊!");
});

// Use the routes
app.use("/api/v1/auth/admin", adminAuthRouter);
app.use("/api/v1/auth/hr", hrAuthRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/hr", hrRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
