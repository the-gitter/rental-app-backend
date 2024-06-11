import BrandModel, { IBrand } from "../../models/ecom/BrandModel";

export default class BrandRepository {
  async createBrand(data: Partial<IBrand>): Promise<IBrand> {
    const brand = new BrandModel(data);
    return brand.save();
  }
  async editBrand({
    userId,
    data,
    brandId,
  }: {
    userId: string;
    data: Partial<IBrand>;
    brandId: string;
  }) {
    return await BrandModel.findOneAndUpdate(
      { _id: brandId, user: userId },
      { $set: data },
      {
        new: true,
      }
    );
  }

  async getAllBrands(): Promise<IBrand[]> {
    return BrandModel.find().exec();
  }
}
