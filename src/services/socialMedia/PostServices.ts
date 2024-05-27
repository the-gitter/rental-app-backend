import { PostsRepository } from "../../repositories/socialMedia/postsRepository";
import { IPostDocument } from "../../models/socialMedia/postModel";
import { Request, Response, NextFunction } from "express";
import { IPayload } from "../../middlewares/firebaseMiddleware";
import createError from "http-errors";
import SendApiResponse from "../../utils/SendApiResponse";
import { validateRequestErrors } from "../../utils/validators/validators";
import CloudinaryRepository from "../../repositories/cloudinary-repository";
export class PostsService {
  constructor() {
    this.createPost = this.createPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.likePost = this.likePost.bind(this);
    this.unlikePost = this.unlikePost.bind(this);
    this.getMyPosts = this.getMyPosts.bind(this);
  }

  private postRepository = new PostsRepository();
  private cloudinaryRepo = new CloudinaryRepository();

  async createPost(req: Request, res: Response, next: NextFunction) {
    if (!validateRequestErrors(req, next)) return;
    const images: {
      secure_url: string;
      public_id: string;
      mime_type: string;
    }[] = [];

    if (req.files) {
      for (const file of req.files as Express.Multer.File[]) {
        try {
          const cnr_res = await this.cloudinaryRepo.uploadFile(
            file.path,
            file.filename,
            "posts"
          );
          images.push({
            mime_type: file.mimetype,
            public_id: cnr_res.public_id,
            secure_url: cnr_res.secure_url,
          });
        } catch (error) {
          return next(
            createError.InternalServerError(`Error uploading file: ${error}`)
          );
        }
      }
    }

    const payload = req.payload as IPayload;
    const { caption,location } = req.body;
    try {
      const post = await this.postRepository.createPost({
        userId: payload.userdocId,
        caption,
        images,
        location
      });
      return SendApiResponse(res, 201, post);
    } catch (error) {
      next(createError.InternalServerError(`${error}`));
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const { postId } = req.params;
      const payload = req.payload as IPayload;
      const post = await this.postRepository.likePost(
        postId,
        payload.userdocId
      );
      return SendApiResponse(res, 200, null, "Post liked successfully");
    } catch (error) {
      next(createError.InternalServerError(`${error}`));
    }
  }

  async unlikePost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const { postId } = req.params;
      const payload = req.payload as IPayload;
      const post = await this.postRepository.unlikePost(
        postId,
        payload.userdocId
      );
      return SendApiResponse(res, 200, null, "Post unliked successfully");
    } catch (error) {
      next(createError.InternalServerError(`${error}`));
    }
  }

  async getMyPosts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;

      const payload = req.payload as IPayload;
      const posts = await this.postRepository.getMyPosts(payload.userdocId);
      return SendApiResponse(res, 200, posts, "success");
    } catch (error) {
      next(createError.InternalServerError(`${error}`));
    }
  }
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;
      const { page = 1, limit = 10 } = req.query;
      const payload = req.payload as IPayload;
      const posts = await this.postRepository.getPosts(
        payload.userdocId,
        parseInt(page as string),
        parseInt(limit as string)
      );
      return SendApiResponse(res, 200, posts, "success");
    } catch (error) {
      next(createError.InternalServerError(`${error}`));
    }
  }
}
