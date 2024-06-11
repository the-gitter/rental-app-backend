import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import SendApiResponse from "../../utils/SendApiResponse";
import DiscountRepository from "../../repositories/ecom/discountsRepository";

class DiscountService {
  private discountRepo: DiscountRepository;

  constructor() {
    this.discountRepo = new DiscountRepository();

    this.activateDiscount = this.activateDiscount .bind(this);
    this.getDiscountById = this.getDiscountById .bind(this);
    this.createDiscount = this.createDiscount .bind(this);
    this.editDiscount = this.editDiscount .bind(this);
    this.removeDiscount = this.removeDiscount .bind(this);
    this.activateDiscount = this.activateDiscount .bind(this);
    this.deactivateDiscount = this.deactivateDiscount .bind(this);
  }

  async getAllDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const discounts = await this.discountRepo.getAllDiscounts();
      return SendApiResponse(res, 200, discounts);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async getDiscountById(req: Request, res: Response, next: NextFunction) {
    try {
      const discount = await this.discountRepo.getDiscountById(req.params.id);
      if (!discount) {
        return next(createError.NotFound("Discount not found"));
      }
      return SendApiResponse(res, 200, discount);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const newDiscount = await this.discountRepo.createDiscount(req.body);
      return SendApiResponse(res, 201, newDiscount);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async editDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedDiscount = await this.discountRepo.editDiscount(req.params.id, req.body);
      if (!updatedDiscount) {
        return next(createError.NotFound("Discount not found"));
      }
      return SendApiResponse(res, 200, updatedDiscount);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async removeDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const removedDiscount = await this.discountRepo.removeDiscount(req.params.id);
      if (!removedDiscount) {
        return next(createError.NotFound("Discount not found"));
      }
      return SendApiResponse(res, 200, removedDiscount);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async activateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const activatedDiscount = await this.discountRepo.activateDiscount(req.params.id);
      if (!activatedDiscount) {
        return next(createError.NotFound("Discount not found"));
      }
      return SendApiResponse(res, 200, activatedDiscount);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async deactivateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const deactivatedDiscount = await this.discountRepo.deactivateDiscount(req.params.id);
      if (!deactivatedDiscount) {
        return next(createError.NotFound("Discount not found"));
      }
      return SendApiResponse(res, 200, deactivatedDiscount);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}

export default DiscountService;
