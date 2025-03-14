import express, { type Express } from "express";
import cors from 'cors';
import dotenv from "dotenv";

// Routes
import authRouter from "./routes/authRoutes";
import userRouter from "@/routes/userRoutes";
import projectRouter from "@/routes/projectRoutes";
import screenRouter from "./routes/screenRoutes";


dotenv.config();
const port = process.env.PORT;
const frontend_url = process.env.FRONTEND_URL;

const app: Express = express();

// Middlewares --------------------------------------------
// cors
app.use(cors({
  origin: frontend_url, // Allow only this origin
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// json parse
app.use(express.json());


// Routes -------------------------------------------------
app.use('/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/users', projectRouter);
app.use('/api/users', screenRouter);


// Server -------------------------------------------------
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
