import express, { NextFunction, Router, Request, Response } from "express";
import UserServices from "../services/userServices";
import firebaseMiddleware, {
  checkIfUserAlearyExists,
  bearerTokenValidator,
} from "../middlewares/firebaseMiddleware";
import { refreshTokenValidator } from "../utils/validators/validators";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt_helper";
import SendApiResponse from "../utils/SendApiResponse";
import BusinessServices from "../services/businessServices";
import multerMiddleware from "../middlewares/multer";
import NotificationServices from "../services/notificationServices";

const notificationService = new NotificationServices();
const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  notificationService.GetNotifications
);
notificationsRouter.patch(
  "/:notificationId/read",
  bearerTokenValidator,
  verifyAccessToken,
  notificationService.MarkAsRead
);
notificationsRouter.delete(
  "/:notificationId",
  bearerTokenValidator,
  verifyAccessToken,
  notificationService.Delete
);

export default notificationsRouter;
