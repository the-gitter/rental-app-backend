import { NextFunction, Request, Response } from "express";
import CloudinaryRepository from "../../repositories/cloudinary-repository";
import CategoryRepository from "../../repositories/ecom/categoryRepository";
import SendApiResponse from "../../utils/SendApiResponse";
import { validateRequestErrors } from "../../utils/validators/validators";
import createError from "http-errors";
import { IPayload } from "../../middlewares/firebaseMiddleware";

class CategoryService {
  private repo: CategoryRepository;
  private cloudinaryRepo: CloudinaryRepository;

  constructor() {
    this.repo = new CategoryRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.repo.get();
      return SendApiResponse(res, 200, categories);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;

      const image = req.file;
      if (image && image.path) {
        const cnr_res = await this.cloudinaryRepo.uploadFile(
          image.path,
          image.filename,
          "categories"
        );
        const logo = {
          mime_type: image.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };

        const newCategory = await this.repo.create({
          userId: payload.userdocId,
          data: { ...req.body, logo_url: logo },
        });

        return SendApiResponse(res, 201, newCategory);
      }
      next(createError.BadRequest("Logo image is required."));
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const payload = req.payload as IPayload;
      const { categoryId } = req.params;

      const image = req.file;
      let updatedData = { ...req.body };

      if (image) {
        const cnr_res = await this.cloudinaryRepo.uploadFile(
          image.path,
          image.filename,
          "brands"
        );
        const banner = {
          mime_type: image.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };
        updatedData = { ...updatedData, logo_url: banner };
      }

      const updatedCategory = await this.repo.edit({
        id: categoryId,
        userId: payload.userdocId,
        data: updatedData,
      });

      if (updatedCategory) {
        return SendApiResponse(res, 200, updatedCategory);
      }
      next(createError.NotFound("Category not found."));
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}

export default CategoryService;
