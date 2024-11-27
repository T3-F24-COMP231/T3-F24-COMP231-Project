import cors from 'cors';
import express, { Application } from "express";
import { errorHandler, requestLogger } from "./middlewares";
import expenseRoutes from './routes/expenseRoutes';
import incomeRoutes from './routes/incomeRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import debtRoutes from './routes/debtRoutes';
import categoryRoutes from './routes/categoryRoutes';
import investmentRoutes from './routes/investmentRoutes';
import roleRoutes from './routes/roleRoutes';

const app: Application = express();

// Middlewares used by the app
app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));


// Routes to be consuded by the app
app.use("/api", authRoutes);
app.use("/api", expenseRoutes);
app.use("/api", incomeRoutes);
app.use("/api", userRoutes);
app.use("/api", debtRoutes);
app.use("/api", categoryRoutes);
app.use("/api", investmentRoutes);
app.use("/api", roleRoutes);



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