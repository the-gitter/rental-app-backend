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
import BillsRepository from "../repositories/billsRepository";
import UserRepository from "../repositories/userRepository";
import NotificationsRepository from "../repositories/notificationRepository";

export default class BillServices {
  private billRepo: BillsRepository;
  private userRepo: UserRepository;
  private notificationRepo: NotificationsRepository;
  private cloudinaryRepo: CloudinaryRepository;
  constructor() {
    this.billRepo = new BillsRepository();
    this.userRepo = new UserRepository();
    this.notificationRepo = new NotificationsRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.CreateBill = this.CreateBill.bind(this);
    this.DeleteBillTemplate = this.DeleteBillTemplate.bind(this);
    this.GetBillById = this.GetBillById.bind(this);
    this.GetBillsForBusiness = this.GetBillsForBusiness.bind(this);
    this.GetBillsForCustomer = this.GetBillsForCustomer.bind(this);
    this.UpdateBillTemplate = this.UpdateBillTemplate.bind(this);
    this.SendCustomerBill = this.SendCustomerBill.bind(this);
  }

  async CreateBill(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const response = await this.billRepo.CreateBill({ data: req.body });
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetBillById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { billId } = req.params;
      const response = await this.billRepo.GetBillById({ billId });
      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetBillsForCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;

      const response = await this.billRepo.GetBillsForCustomer({
        customer: payload?.userdocId!,
      });
      return SendApiResponse(res, 200, response);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async GetBillsForBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const { businessId } = req.params;
      const response = await this.billRepo.GetBillsForBusiness({
        businessId,
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
      const response = await this.billRepo.UpdateBillTemplate({
        templateId,
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
      const response = await this.billRepo.DeleteBillTemplate({
        templateId,
      });
      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async SendCustomerBill(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { customerId, billId } = req.params;
      const { message } = req.body;

      const response = await this.userRepo.SendBillToCustomer({
        billId,
        customerId,
      });

      await this.notificationRepo.Create({
        data: { user: customerId, message: message ?? "New Bill Recieved" },
      });
      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}
