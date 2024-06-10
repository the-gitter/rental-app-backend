import express from "express";
import ProductService from "../../services/ecom/productsServices";
import { bearerTokenValidator } from "../../middlewares/firebaseMiddleware";
import { verifyAccessToken } from "../../utils/jwt_helper";
import { Request, Response, NextFunction } from "express";
import { authorize } from "../../utils/validators/validators";
import multerMiddleware from "../../middlewares/multer";
const productRouter = express.Router();
const productService = new ProductService();

productRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) => {
    productService.getAllProducts(req, res, next);
  }
);

productRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.array('image'),
  (req: Request, res: Response, next: NextFunction) => {
    productService.createProduct(req, res, next);
  }
);

productRouter.delete(
  "/:id/image",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  (req: Request, res: Response, next: NextFunction) =>
    productService.deleteProductImage(req, res, next)
);

productRouter.get(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) => {
    productService.getProductById(req, res, next);
  }
);

productRouter.put(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.array('image'),
  (req: Request, res: Response, next: NextFunction) => {
    productService.editProduct(req, res, next);
  }
);

productRouter.delete(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  (req: Request, res: Response, next: NextFunction) => {
    productService.deleteProduct(req, res, next);
  }
);

export default productRouter;
