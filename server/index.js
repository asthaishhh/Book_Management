import express from 'express';
import cors from "cors";
import connectDB from './database.js';
import bookRouter from './routes/books.route.js';
import authRouter from './routes/auth.route.js';
import dotenv from "dotenv";
import morgan, { format } from "morgan";
import cookieParser from 'cookie-parser';


dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("REQUEST HIT:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/api/auth', authRouter);
app.use('/book', bookRouter);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
