import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import SendApiResponse from "../../utils/SendApiResponse";
import CloudinaryRepository from "../../repositories/cloudinary-repository";
import CollectionsRepository from "../../repositories/ecom/collectionsRepository";

class CollectionsService {
  private collectionRepo: CollectionsRepository;
  private cloudinaryRepo: CloudinaryRepository;

  constructor() {
    this.collectionRepo = new CollectionsRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.createCollection = this.createCollection.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
    this.deleteCollectionImage = this.deleteCollectionImage.bind(this);
    this.editCollection = this.editCollection.bind(this);
    this.getAllCollectionss = this.getAllCollectionss.bind(this);
    this.getCollectionsById = this.getCollectionsById.bind(this);
  }

  async getAllCollectionss(req: Request, res: Response, next: NextFunction) {
    try {
      const variants = await this.collectionRepo.getAllCollectionss();
      return SendApiResponse(res, 200, variants);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async getCollectionsById(req: Request, res: Response, next: NextFunction) {
    try {
      const variant = await this.collectionRepo.getCollectionsById(
        req.params.id
      );
      if (!variant) {
        return next(createError.NotFound("Collection not found"));
      }
      return SendApiResponse(res, 200, variant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async createCollection(req: Request, res: Response, next: NextFunction) {
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
            "collections"
          );
          imageUrls.push({
            mime_type: imageFile.mimetype,
            public_id: cnr_res.public_id,
            secure_url: cnr_res.secure_url,
          });
        }
      );

      const newVariant = await this.collectionRepo.createCollections({
        ...req.body,
        user: req.payload?.userdocId,
        images: imageUrls,
      });
      return SendApiResponse(res, 201, newVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async editCollection(req: Request, res: Response, next: NextFunction) {
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
      const updatedVariant = await this.collectionRepo.editCollections(
        req.params.id,
        {
          ...req.body,
          user: req.payload?.userdocId,
          images: imageUrls,
        }
      );

      if (!updatedVariant) {
        return next(createError.NotFound("Variant not found"));
      }
      return SendApiResponse(res, 200, updatedVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async deleteCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedVariant = await this.collectionRepo.deleteCollections(
        req.params.id
      );
      if (deletedVariant) {
        deletedVariant?.images.map(async (img) => {
          await this.cloudinaryRepo.deleteFile(img.public_id);
        });
      }

      if (!deletedVariant) {
        return next(createError.NotFound("Collection not found"));
      }
      return SendApiResponse(res, 200, deletedVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async deleteCollectionImage(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedVariant = await this.collectionRepo.deleteCollectionImage({
        productId: req.params.id,
        publicId: req.body.publicId,
      });
      if (deletedVariant) {
        await this.cloudinaryRepo.deleteFile(req.body.publicId);
      }

      if (!deletedVariant || deletedVariant.isModified()) {
        return next(createError.NotFound("Collection not found"));
      }
      return SendApiResponse(res, 200, deletedVariant);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}

export default CollectionsService;
