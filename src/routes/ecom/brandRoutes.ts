import express, { NextFunction, Router, Request, Response } from "express";
import { bearerTokenValidator } from "../../middlewares/firebaseMiddleware";
import { verifyAccessToken } from "../../utils/jwt_helper";
import BrandServices from "../../services/ecom/brandsServices";
import multerMiddleware from "../../middlewares/multer";
import { authorize } from "../../utils/validators/validators";

const brandServices = new BrandServices();
const brandsRouter = Router();

brandsRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) => {
    brandServices.getAllBrands(req, res, next);
  }
);

brandsRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.single('logo'),
  (req: Request, res: Response, next: NextFunction) => {
    brandServices.createBrand(req, res, next);
  }
);

brandsRouter.put(
  "/:brandId",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.single('logo'),
  (req: Request, res: Response, next: NextFunction) => {
    brandServices.editBrand(req, res, next);
  }
);

export default brandsRouter;
