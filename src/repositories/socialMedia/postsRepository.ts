import mongoose from 'mongoose';
import { PostModel, IPostDocument } from '../../models/socialMedia/postModel';

export class PostsRepository {
  constructor(){
    this.createPost= this.createPost.bind(this)
    this.getPosts= this.getPosts.bind(this)
    this.likePost= this.likePost.bind(this)
    this.unlikePost  = this.unlikePost.bind(this)
    this.getPostsWithUserLikes = this.getPostsWithUserLikes.bind(this)
  }
  async createPost(postData: Partial<IPostDocument>): Promise<IPostDocument> {
    const post = new PostModel(postData);
    return post.save();
  }

  async findPostById(postId: string): Promise<IPostDocument | null> {
    return PostModel.findById(postId).populate('userId', 'username profilePicture').exec();
  }

  async likePost(postId: string, userId: string): Promise<void> {
    await PostModel.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId }
    });
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await PostModel.findByIdAndUpdate(postId, {
      $pull: { likes: userId }
    });
  }

  async getPostsWithUserLikes(userId: string): Promise<IPostDocument[]> {
    return PostModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: 1,
          caption: 1,
          imageUrl: 1,
          likes: 1,
          shares: 1,
          createdAt: 1,
          likedByCurrentUser: { $in: [userId, '$likes'] }
        }
      }
    ]);
  }
  async getPosts(userId: string): Promise<IPostDocument[]> {
    return PostModel.find()
  }
}
