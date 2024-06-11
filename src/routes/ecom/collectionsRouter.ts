import express from "express";
import ProductService from "../../services/ecom/productsServices";
import { bearerTokenValidator } from "../../middlewares/firebaseMiddleware";
import { verifyAccessToken } from "../../utils/jwt_helper";
import { Request, Response, NextFunction } from "express";
import { authorize } from "../../utils/validators/validators";
import multerMiddleware from "../../middlewares/multer";
import CollectionsService from "../../services/ecom/collectionsServices";
const collectionsRouter = express.Router();
const productService = new CollectionsService();

collectionsRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) => {
    productService.getAllCollectionss(req, res, next);
  }
);

collectionsRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.array('image'),
  (req: Request, res: Response, next: NextFunction) => {
    productService.createCollection(req, res, next);
  }
);

collectionsRouter.delete(
  "/:id/image",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  (req: Request, res: Response, next: NextFunction) =>
    productService.deleteCollectionImage(req, res, next)
);

collectionsRouter.get(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) => {
    productService.getCollectionsById(req, res, next);
  }
);

collectionsRouter.put(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.array('image'),
  (req: Request, res: Response, next: NextFunction) => {
    productService.editCollection(req, res, next);
  }
);

collectionsRouter.delete(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  (req: Request, res: Response, next: NextFunction) => {
    productService.deleteCollection(req, res, next);
  }
);

export default collectionsRouter;
