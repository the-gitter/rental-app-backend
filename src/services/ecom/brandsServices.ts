import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import BrandRepository from "../../repositories/ecom/brandsRepository";
import { validateRequestErrors } from "../../utils/validators/validators";
import { IPayload } from "../../middlewares/firebaseMiddleware";
import SendApiResponse from "../../utils/SendApiResponse";
import CloudinaryRepository from "../../repositories/cloudinary-repository";

export default class BrandServices {
  private brandRepo: BrandRepository;
  private cloudinaryRepo: CloudinaryRepository;



  constructor() {
    this.brandRepo = new BrandRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.createBrand = this.createBrand.bind(this)
    this.editBrand = this.editBrand.bind(this)
    this.getAllBrands = this.getAllBrands.bind(this)
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;

      const image = req.file;
      if (image && image.path) {
        let logo: {
          secure_url?: string;
          public_id?: string;
          mime_type?: string;
        } = {};

        const cnr_res = await this.cloudinaryRepo.uploadFile(
          image?.path,
          image?.filename,
          "brands"
        );
        logo = {
          mime_type: image.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };
        const newBrand = await this.brandRepo.createBrand({
          user: payload.userdocId,
          ...req.body,
          logo_url: logo,
        });
        return SendApiResponse(res, 201, newBrand);
      }
      next(createError.BadRequest);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async editBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { brandId } = req.params;

      const image = req.file;

      if (image) {
        let banner: {
          secure_url?: string;
          public_id?: string;
          mime_type?: string;
        } = {};

        const cnr_res = await this.cloudinaryRepo.uploadFile(
          image.path,
          image.filename,
          "brands"
        );
        banner = {
          mime_type: image.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };
        const response = await this.brandRepo?.editBrand({
          userId:payload.userdocId,
          brandId,
          data: { ...req.body, logo_url: banner },
        });

        if (response?.logo_url) {
          await this.cloudinaryRepo.deleteFile(response.logo_url.public_id);
        }

        return SendApiResponse(res, 200, response);
      } else {
        const response = await this.brandRepo?.editBrand({
          userId:payload.userdocId,
          brandId,
          data: { ...req.body },
        });

        return SendApiResponse(res, 200, response);
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;

      const brands = await this.brandRepo.getAllBrands();

      return SendApiResponse(res, 200, brands);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  // Add more methods as needed
}
