import express from "express";
import VariantService from "../../services/ecom/variantsServices";
import { bearerTokenValidator } from "../../middlewares/firebaseMiddleware";
import { verifyAccessToken } from "../../utils/jwt_helper";

import { Request, Response, NextFunction } from "express";
import { authorize } from "../../utils/validators/validators";
import multerMiddleware from "../../middlewares/multer";
const variantRouter = express.Router();
const variantService = new VariantService();

variantRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) =>
    variantService.getAllVariants(req, res, next)
);

variantRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.array('images'),
  (req: Request, res: Response, next: NextFunction) =>
    variantService.createVariant(req, res, next)
);

variantRouter.delete(
  "/:id/image",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  (req: Request, res: Response, next: NextFunction) =>
    variantService.deleteVariantImage(req, res, next)
);

variantRouter.get(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) =>
    variantService.getVariantById(req, res, next)
);

variantRouter.put(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.array('images'),
  (req: Request, res: Response, next: NextFunction) =>
    variantService.editVariant(req, res, next)
);

variantRouter.delete(
  "/:id",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  (req: Request, res: Response, next: NextFunction) =>
    variantService.deleteVariant(req, res, next)
);

export default variantRouter;
