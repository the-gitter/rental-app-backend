import mongoose from "mongoose";
import { PostModel, IPostDocument } from "../../models/socialMedia/postModel";

export class PostsRepository {
  constructor() {
    this.createPost = this.createPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.likePost = this.likePost.bind(this);
    this.unlikePost = this.unlikePost.bind(this);
    this.getMyPosts = this.getMyPosts.bind(this);
  }
  async createPost(postData: Partial<IPostDocument>): Promise<IPostDocument> {
    const post = new PostModel(postData);
    return post.save();
  }

  async findPostById(postId: string): Promise<IPostDocument | null> {
    return PostModel.findById(postId)
      .populate("userId", "username profilePicture")
      .exec();
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    await PostModel.findOneAndDelete({
      _id: postId,
      userId,
    });
  }
  async likePost(postId: string, userId: string): Promise<void> {
    await PostModel.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await PostModel.findByIdAndUpdate(postId, {
      $pull: { likes: userId },
    });
  }

  async getMyPosts(userId: string): Promise<IPostDocument[]> {
    return PostModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          likedByCurrentUser: {
            $in: [new mongoose.Types.ObjectId(userId), "$likes"],
          },
          totalLikes: { $size: "$likes" },
        },
      },
      {
        $project: {
          user: {
            _id: 1,
            first_name: 1,
            last_name: 1,
          },
          caption: 1,
          images: 1,
          shares: 1,
          createdAt: 1,
          totalLikes: 1,
          likedByCurrentUser: 1,
        },
      },
    ]);
  }

  async getPosts(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPostDocument[]> {
    return PostModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          likedByCurrentUser: {
            $in: [new mongoose.Types.ObjectId(userId), "$likes"],
          },
          totalLikes: { $size: "$likes" },
        },
      },
      {
        $project: {
          user: {
            _id: 1,
            first_name: 1,
            last_name: 1,
          },
          caption: 1,
          images: 1,
          shares: 1,
          createdAt: 1,
          totalLikes: 1,
          likedByCurrentUser: 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
  }
}
