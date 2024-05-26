import { Request, Response, NextFunction } from "express";
import AuthRepository from "../repositories/authRepository";
import SendApiResponse from "../utils/SendApiResponse";
import { validationResult } from "express-validator";
import createError from "http-errors";
import {
  blacklistAccessToken,
  removeRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt_helper";
import UserModel from "../models/userModel";
import { validateRequestErrors } from "../utils/validators/validators";
import { getTokenFromHeader } from "../utils/validators/handlers";
import { IPayload } from "../middlewares/firebaseMiddleware";
import BusinessRepository from "../repositories/businessRepository";
import CloudinaryRepository from "../repositories/cloudinary-repository";
import BillTemplatesRepository from "../repositories/billTempletRepository";
import NotificationsRepository from "../repositories/notificationRepository";
import notificationModel from "../models/notificationModel";

export default class NotificationServices {
  private notificationRepo: NotificationsRepository;
  private cloudinaryRepo: CloudinaryRepository;
  constructor() {
    this.notificationRepo = new NotificationsRepository();
    this.cloudinaryRepo = new CloudinaryRepository();
    this.Delete = this.Delete.bind(this);
    this.GetNotifications = this.GetNotifications.bind(this);
    this.MarkAsRead = this.MarkAsRead.bind(this);
  }

  async GetNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const response = await this.notificationRepo.Get({
        userId: payload.userdocId,
      });
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async MarkAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const { notificationId } = req.params;
      const response = await this.notificationRepo.MarkAsRead({
        notificationId,
      });
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { notificationId } = req.params;
      const response = await this.notificationRepo.Delete({
        notificationId,
        userId: payload.userdocId,
      });
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}
