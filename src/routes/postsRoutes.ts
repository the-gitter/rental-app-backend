import express, { NextFunction, Router, Request, Response } from "express";
import UserServices from "../services/userServices";
import firebaseMiddleware, {
  checkIfUserAlearyExists,
  bearerTokenValidator,
} from "../middlewares/firebaseMiddleware";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt_helper";
import { PostsRepository } from "../repositories/socialMedia/postsRepository";
import { PostsService } from "../services/socialMedia/PostServices";
import multerMiddleware from "../middlewares/multer";

const postsService = new PostsService();
const postsRouter = Router();

postsRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  multerMiddleware.array('images'),
  postsService.createPost
);
postsRouter.post(
  "/:postId/like",
  bearerTokenValidator,
  verifyAccessToken,
  postsService.likePost
);
postsRouter.post(
  "/:postId/unlike",
  bearerTokenValidator,
  verifyAccessToken,
  postsService.unlikePost
);
postsRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  postsService.getPosts
);
postsRouter.get(
  "/user",
  bearerTokenValidator,
  verifyAccessToken,
  postsService.getPostsWithUserLikes
);
export default postsRouter;
