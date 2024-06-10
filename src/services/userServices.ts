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
    // this.GetBillHistory = this.GetBillHistory.bind(this);
    this.GetUserById = this.GetUserById.bind(this);
    this.UpdateUser = this.UpdateUser.bind(this);
    this.GetUser = this.GetUser.bind(this);
    this.GetUsers = this.GetUsers.bind(this);
    this.SearchUsers = this.SearchUsers.bind(this);

    this.CreateAddress = this.CreateAddress.bind(this);
    this.DeleteAddress = this.DeleteAddress.bind(this);
    this.UpdateAddress = this.UpdateAddress.bind(this);
    this.addUserRole = this.addUserRole.bind(this);
    this.removeUserRole = this.removeUserRole.bind(this);
  }

  async CreateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;

      const data = await this.userRepo.CreateAddress({
        ...req.body,
        uid: payload.uid,
      });
      await this.userRepo.UpdateUserById({
        userId: payload.userdocId,
        data: { address: data._id },
      });

      return SendApiResponse(res, 201, data);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async UpdateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const user = await this.userRepo.GetUserById({
        userId: payload.userdocId,
      });
      if (user && user.address) {
        const address = await this.userRepo.UpdateAddress({
          add: req.body,
          addId: user?.address,
        });
        return SendApiResponse(res, 200, address);
      } else {
        next(createError.NotAcceptable(`invalid request`));
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async DeleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const user = await this.userRepo.GetUserById({
        userId: payload.userdocId,
      });
      if (user && user.address) {
        const address = await this.userRepo.DeleteAddress(user?.address);
        await this.userRepo.UpdateUserById({
          userId: payload.userdocId,
          data: { address: undefined },
        });
        return SendApiResponse(res, 200, address, "deleted");
      } else {
        next(createError.NotAcceptable(`invalid request`));
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async addUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const user = await this.userRepo.addUserRole({
        userId: req.body.userId,
        role: req.body.role,
      });
      if (user) {
        return SendApiResponse(res, 200, user, "added user role");
      } else {
        next(createError.NotAcceptable(`invalid request`));
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async removeUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const user = await this.userRepo.removeUserRole({
        userId: req.body.userId,
        role: req.body.role,
      });
      if (user) {
        return SendApiResponse(res, 200, user, "removed user role");
      } else {
        next(createError.NotAcceptable(`invalid request`));
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async SearchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, email, name } = req.query as {
        phone_number?: string;
        email?: string;
        name?: string;
      };
      const data = await this.userRepo?.SearchUsers({
        email,
        name,
        phone_number,
      });
      return SendApiResponse(res, 200, data);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const data = await this.userRepo?.GetUserById({
        userId: payload.userdocId,
      });
      return SendApiResponse(res, 200, data);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetUsers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const data = await this.userRepo?.GetUsers();
      return SendApiResponse(res, 200, data);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetUserById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const { userId } = req.params;
      const data = await this.userRepo?.GetUserById({ userId });
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
          userId: payload.userdocId,
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
          userId: payload.userdocId,
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

  // async GetBillHistory(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     if (!validateRequestErrors(req, next)) return;

  //     const payload = req.payload as IPayload;
  //     const response = await this.userRepo.GetBillHistory({
  //       userId: payload.userdocId,
  //     });

  //     return SendApiResponse(res, 200, response);
  //   } catch (err) {
  //     next(createError.InternalServerError(`${err}`));
  //   }
  // }
}
