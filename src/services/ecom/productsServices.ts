import { Request, Response, NextFunction } from "express";
import ProductRepository from "../../repositories/ecom/productsRepository";
import VariantRepository from "../../repositories/ecom/variantsRepository";
import createError from "http-errors";
import SendApiResponse from "../../utils/SendApiResponse";
import CloudinaryRepository from "../../repositories/cloudinary-repository";

class ProductService {
  private productRepo: ProductRepository;
  private variantRepo: VariantRepository;
  private cloudinaryRepo: CloudinaryRepository;

  constructor() {
    this.productRepo = new ProductRepository();
    this.variantRepo = new VariantRepository();
    this.cloudinaryRepo = new CloudinaryRepository();

    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.deleteProductImage = this.deleteProductImage.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productRepo.getAllProducts();
      return SendApiResponse(res, 200, products);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productRepo.getProductById(req.params.id);
      if (!product) {
        return next(createError.NotFound("Product not found"));
      }
      return SendApiResponse(res, 200, product);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
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
          "products"
        );
        logo = {
          mime_type: image.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };
        const newProduct = await this.productRepo.createProduct({
          ...req.body,
          user: req.payload?.userdocId,
          image: logo,
        });
        return SendApiResponse(res, 201, newProduct);
      } else {
        next(createError.NotAcceptable("image / logo not passed"));
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async editProduct(req: Request, res: Response, next: NextFunction) {
    try {
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
          "products"
        );
        logo = {
          mime_type: image.mimetype,
          public_id: cnr_res.public_id,
          secure_url: cnr_res.secure_url,
        };
        const updatedProduct = await this.productRepo.editProduct(
          req.params.id,
          { ...req.body, image: logo, user: req.payload?.userdocId }
        );
        return SendApiResponse(res, 200, updatedProduct);
      } else {
        const updatedProduct = await this.productRepo.editProduct(
          req.params.id,
          req.body
        );
        return SendApiResponse(res, 200, updatedProduct);
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedProduct = await this.productRepo.deleteProduct(
        req.params.id
      );
      if (deletedProduct) {
        deletedProduct?.variants.map(async (variant) => {
          const deletedVariant = await this.variantRepo.deleteVariant(
            variant.toString()
          );
          deletedVariant?.images.map(async (img) => {
            await this.cloudinaryRepo.deleteFile(img.public_id);
          });
        });

        if (deletedProduct.image) {
          this.cloudinaryRepo.deleteFile(deletedProduct.image.public_id);
        }
      }

      if (!deletedProduct) {
        return next(createError.NotFound("Product not found"));
      }
      return SendApiResponse(res, 200, deletedProduct);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
  async deleteProductImage(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedProduct = await this.productRepo.deleteProductImage(
        req.params.id
      );
      if (deletedProduct && deletedProduct.isModified()) {
        if (deletedProduct.image) {
          this.cloudinaryRepo.deleteFile(deletedProduct.image.public_id);
        }
      }

      if (!deletedProduct || !deletedProduct.isModified()) {
        return next(createError.NotFound("No changes made"));
      }
      return SendApiResponse(res, 200, deletedProduct);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}

export default ProductService;
