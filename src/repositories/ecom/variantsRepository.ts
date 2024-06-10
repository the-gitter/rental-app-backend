import VariantModel, { IVariant } from "../../models/ecom/VariantModel";
import mongoose from "mongoose";

class VariantRepository {
  async createVariant(data: Partial<IVariant>) {
    const variant = new VariantModel(data);
    await variant.save();
    return variant;
  }

  async editVariant(id: string, data: Partial<IVariant>) {
    return VariantModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteVariant(id: string) {
    return VariantModel.findByIdAndDelete(id).exec();
  }

  async getAllVariants() {
    return VariantModel.find().exec();
  }

  async getVariantById(id: string) {
    return VariantModel.findById(id).exec();
  }
  async deleteVariantImage({
    productId,
    publicId,
  }: {
    productId: String;
    publicId: string;
  }) {
    return VariantModel.findByIdAndUpdate(productId, {
      $pull: {
        images: { public_id: publicId },
      },
    });
  }
}

export default VariantRepository;
