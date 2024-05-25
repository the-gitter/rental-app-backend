import { Request, Response, NextFunction } from "express";
import AuthRepository from "../repositories/authRepository";
import UserRepository from "../repositories/userRepository";
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
import CloudinaryRepository from "../repositories/cloudinary-repository";

export default class UserServices {
  private userRepo: UserRepository;
  private cloudinaryRepo: CloudinaryRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.DeleteUser = this.DeleteUser.bind(this);
    this.GetBillHistory = this.GetBillHistory.bind(this);
    this.GetUserById = this.GetUserById.bind(this);
    this.UpdateUser = this.UpdateUser.bind(this);
  }

  async GetUserById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const { uid } = req.params;
      const data = await this.userRepo?.GetUserById({ uid });
      return SendApiResponse(res, 200, data);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async UpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      let response;
      if (req.file) {
        let photo_url: {
          secure_url?: string;
          public_id?: string;
          mime_type?: string;
          uploaded_type?: "url" | "cloud";
        } = {};

        const cnr_res = await this.cloudinaryRepo.uploadFile(
          req.file.path,
          req.file.filename
        );
        photo_url = {
          mime_type: req.file.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
          uploaded_type: "cloud",
        };
        response = await this.userRepo?.UpdateUserById({
          uid: payload.uid,
          data: { ...req.body, photo_url },
        });

        if (
          response?.photo_url &&
          response.photo_url.uploaded_type == "cloud"
        ) {
          await this.cloudinaryRepo.deleteFile(response.photo_url.public_id);
        }
      } else {
        response = await this.userRepo?.UpdateUserById({
          uid: payload.uid,
          data: req.body,
        });
      }
      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async DeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const response = await this.userRepo.DeleteUserById({ uid: payload.uid });

      if (response?.photo_url && response.photo_url.uploaded_type == "cloud") {
        await this.cloudinaryRepo.deleteFile(response.photo_url.public_id);
      }

      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async GetBillHistory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;

      const payload = req.payload as IPayload;
      const response = await this.userRepo.GetBillHistory({ uid: payload.uid });

      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}
