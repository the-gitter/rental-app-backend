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

export default class BusinessServices {
  private businessRepo: BusinessRepository;
  private billTemplatesRepo: BillTemplatesRepository;
  private cloudinaryRepo: CloudinaryRepository;
  constructor() {
    this.billTemplatesRepo = new BillTemplatesRepository();
    this.businessRepo = new BusinessRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.CreateNewProfile = this.CreateNewProfile.bind(this);
    this.DeletBusiness = this.DeletBusiness.bind(this);
    this.GetBusinessById = this.GetBusinessById.bind(this);
    this.GetBusinesses = this.GetBusinesses.bind(this);
    this.UpdateBusiness = this.UpdateBusiness.bind(this);
  }

  async CreateNewProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      let response;
      if (req.file) {
        let banner: {
          secure_url?: string;
          public_id?: string;
          mime_type?: string;
        } = {};

        const cnr_res = await this.cloudinaryRepo.uploadFile(
          req.file.path,
          req.file.filename
        );
        banner = {
          mime_type: req.file.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };
        response = await this.businessRepo?.CreateNewProfile({
          data: { ...req.body, banner, owner: payload.userdocId },
        });
      }
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async GetBusinesses(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const response = await this.businessRepo.GetBusinesses();
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetBusinessById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;

      const { ownerId } = req.params;
      const response = await this.businessRepo.GetBusinessById({ ownerId });
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async UpdateBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      let response;
      if (req.file) {
        let banner: {
          secure_url?: string;
          public_id?: string;
          mime_type?: string;
        } = {};

        const cnr_res = await this.cloudinaryRepo.uploadFile(
          req.file.path,
          req.file.filename
        );
        banner = {
          mime_type: req.file.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };
        response = await this.businessRepo?.CreateNewProfile({
          data: { ...req.body, banner },
        });

        if (response?.banner) {
          await this.cloudinaryRepo.deleteFile(response.banner.public_id);
        }
      } else {
        response = await this.businessRepo?.UpdateBusiness({
          ownerId: payload.userdocId,
          data: req.body,
        });
      }

      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async DeletBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const response = await this.businessRepo.DeleteBusinness({
        ownerId: payload.userdocId,
      });

      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  //Bill Template Management
  async CreateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const response = await this.billTemplatesRepo.CreateTemplate(req.body);
      return SendApiResponse(res, 201, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetBillTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { businessId } = req.params;
      const response = await this.billTemplatesRepo.GetBillTemplates({
        businessId,
      });

      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetBillTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { templateId } = req.params;
      const response = await this.billTemplatesRepo.GetBillTemplate({
        templateId,
      });

      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async UpdateBillTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { templateId } = req.params;
      const response = await this.billTemplatesRepo.UpdateBillTemplate({
        templateId: templateId,
        data: req.body,
      });
      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async DeleteBillTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { templateId } = req.params;
      const response = await this.billTemplatesRepo.DeleteBillTemplate({
        templateId,
      });
      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}
