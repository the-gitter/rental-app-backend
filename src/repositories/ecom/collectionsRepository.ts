import mongoose from "mongoose";
import CollectionsModel, { ICollection } from "../../models/ecom/CollectionsModel";

class CollectionsRepository {
  async createCollections(data: Partial<ICollection>) {
    const Collections = new CollectionsModel(data);
    await Collections.save();
    return Collections;
  }

  async editCollections(id: string, data: Partial<ICollection>) {
    return CollectionsModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteCollections(id: string) {
    return CollectionsModel.findByIdAndDelete(id).exec();
  }

  async getAllCollectionss() {
    return CollectionsModel.find().exec();
  }

  async getCollectionsById(id: string) {
    return CollectionsModel.findById(id).exec();
  }
  async deleteCollectionImage({
    productId,
    publicId,
  }: {
    productId: String;
    publicId: string;
  }) {
    return CollectionsModel.findByIdAndUpdate(productId, {
      $pull: {
        images: { public_id: publicId },
      },
    });
  }
}

export default CollectionsRepository;
