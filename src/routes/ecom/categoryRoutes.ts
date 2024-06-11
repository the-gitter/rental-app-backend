import express, { NextFunction, Request, Response } from "express";
import { bearerTokenValidator } from "../../middlewares/firebaseMiddleware";
import { verifyAccessToken } from "../../utils/jwt_helper"; 
import multerMiddleware from "../../middlewares/multer";
import CategoryService from "../../services/ecom/categoryService";
import { authorize } from "../../utils/validators/validators";

const categoryService = new CategoryService();
const categoryRouter = express.Router();

categoryRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  (req: Request, res: Response, next: NextFunction) => {
    categoryService.get(req, res, next);
  }
);

categoryRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.single("logo"),
  (req: Request, res: Response, next: NextFunction) => {
    categoryService.create(req, res, next);
  }
);

categoryRouter.put(
  "/:categoryId",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  multerMiddleware.single("logo"),
  (req: Request, res: Response, next: NextFunction) => {
    categoryService.edit(req, res, next);
  }
);

export default categoryRouter;
