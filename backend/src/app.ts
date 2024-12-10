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
import notificationRoutes from './routes/notificationRoutes';
import transactionRoutes from './routes/transactionRoutes';
import activityRoutes from './routes/activityRoutes';
import savingRoutes from './routes/savingRoutes';

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
app.use("/api", notificationRoutes);
app.use("/api", transactionRoutes);
app.use("/api", activityRoutes);
app.use("/api", savingRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to T3-F24-COMP231 API!");
});

export default app;