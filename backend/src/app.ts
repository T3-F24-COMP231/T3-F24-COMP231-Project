import cors from 'cors';
import express, { Application } from "express";
import { errorHandler, requestLogger } from "./middlewares";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: 'http://localhost:4000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

app.get("/", (req, res) => {
  res.send("Welcome to T3-F24-COMP231 API!");
});

export default app;