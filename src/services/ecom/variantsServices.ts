import { Request, Response, NextFunction } from "express";
import VariantRepository from "../../repositories/ecom/variantsRepository";
import createError from "http-errors";
import SendApiResponse from "../../utils/SendApiResponse";
import CloudinaryRepository from "../../repositories/cloudinary-repository";

class VariantService {
  private variantRepo: VariantRepository;
  private cloudinaryRepo: CloudinaryRepository;

  constructor() {
    this.variantRepo = new VariantRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.createVariant = this.createVariant.bind(this);
    this.deleteVariant = this.deleteVariant.bind(this);
    this.deleteVariantImage = this.deleteVariantImage.bind(this);
    this.editVariant = this.editVariant.bind(this);
    this.getAllVariants = this.getAllVariants.bind(this);
    this.getVariantById = this.getVariantById.bind(this);
  }

  async getAllVariants(req: Request, res: Response, next: NextFunction) {
    try {
      const variants = await this.variantRepo.getAllVariants();
      return SendApiResponse(res, 200, variants);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async getVariantById(req: Request, res: Response, next: NextFunction) {
    try {
      const variant = await this.variantRepo.getVariantById(req.params.id);
      if (!variant) {
        return next(createError.NotFound("Variant not found"));
      }
      return SendApiResponse(res, 200, variant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async createVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const images = req.files;
      const imageUrls: {
        secure_url?: string;
        public_id?: string;
        mime_type?: string;
      }[] = [];

      ((images as Express.Multer.File[]) ?? [])?.map(
        async (imageFile: Express.Multer.File) => {
          const cnr_res = await this.cloudinaryRepo.uploadFile(
            imageFile?.path,
            imageFile?.filename,
            "variants"
          );
          imageUrls.push({
            mime_type: imageFile.mimetype,
            public_id: cnr_res.public_id,
            secure_url: cnr_res.secure_url,
          });
        }
      );

      const newVariant = await this.variantRepo.createVariant({
        ...req.body,
        user: req.payload?.userdocId,
        images: imageUrls,
      });
      return SendApiResponse(res, 201, newVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async editVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const images = req.files;
      const imageUrls: {
        secure_url?: string;
        public_id?: string;
        mime_type?: string;
      }[] = [];

      ((images as Express.Multer.File[]) ?? [])?.map(
        async (imageFile: Express.Multer.File) => {
          const cnr_res = await this.cloudinaryRepo.uploadFile(
            imageFile?.path,
            imageFile?.filename,
            "variants"
          );
          imageUrls.push({
            mime_type: imageFile.mimetype,
            public_id: cnr_res.public_id,
            secure_url: cnr_res.secure_url,
          });
        }
      );
      const updatedVariant = await this.variantRepo.editVariant(req.params.id, {
        ...req.body,
        user: req.payload?.userdocId,
        images: imageUrls,
      });

      if (!updatedVariant) {
        return next(createError.NotFound("Variant not found"));
      }
      return SendApiResponse(res, 200, updatedVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async deleteVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedVariant = await this.variantRepo.deleteVariant(
        req.params.id
      );
      if (deletedVariant) {
        deletedVariant?.images.map(async (img) => {
          await this.cloudinaryRepo.deleteFile(img.public_id);
        });
      }

      if (!deletedVariant) {
        return next(createError.NotFound("Variant not found"));
      }
      return SendApiResponse(res, 200, deletedVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async deleteVariantImage(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedVariant = await this.variantRepo.deleteVariantImage({
        productId: req.params.id,
        publicId: req.body.publicId,
      });
      if (deletedVariant) {
        await this.cloudinaryRepo.deleteFile(req.body.publicId);
      }

      if (!deletedVariant || deletedVariant.isModified()) {
        return next(createError.NotFound("Variant not found"));
      }
      return SendApiResponse(res, 200, deletedVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}

export default VariantService;
