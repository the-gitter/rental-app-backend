import DiscountModel, { IDiscount } from "../../models/ecom/DiscountModel";
import mongoose from "mongoose";

class DiscountRepository {
  async createDiscount(data: Partial<IDiscount>) {
    const discount = new DiscountModel(data);
    await discount.save();
    return discount;
  }

  async editDiscount(id: string, data: Partial<IDiscount>) {
    return DiscountModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async removeDiscount(id: string) {
    return DiscountModel.findByIdAndDelete(id).exec();
  }

  async activateDiscount(id: string) {
    return DiscountModel.findByIdAndUpdate(id, { active: true }, { new: true }).exec();
  }

  async deactivateDiscount(id: string) {
    return DiscountModel.findByIdAndUpdate(id, { active: false }, { new: true }).exec();
  }

  async getAllDiscounts() {
    return DiscountModel.find().exec();
  }

  async getDiscountById(id: string) {
    return DiscountModel.findById(id).exec();
  }
}

export default DiscountRepository;
