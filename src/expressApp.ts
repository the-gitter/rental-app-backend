import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import MessageBrokerService from "./utils/message_broker/message_broker";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import businessRouter from "./routes/businessRoutes";
import notificationsRouter from "./routes/notificationsRoutes";
import billsRouter from "./routes/billsRoutes";

export default async (app: Express, messageBroker?: MessageBrokerService) => {
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );

  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/businesses", businessRouter);
  app.use("/bills", billsRouter);
  app.use("/notifications", notificationsRouter);
};
