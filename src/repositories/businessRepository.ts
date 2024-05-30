import BusinessModel, { IBusiness } from "../models/businessModel";

export default class BusinessRepository {
  constructor() {
    this.CreateNewProfile = this.CreateNewProfile.bind(this);
    this.DeleteBusinness = this.DeleteBusinness.bind(this);
    this.GetBusinessById = this.GetBusinessById.bind(this);
    this.GetBusinesses = this.GetBusinesses.bind(this);
    this.UpdateBusiness = this.UpdateBusiness.bind(this);
    this.GetMyBusiness = this.GetMyBusiness.bind(this);
  }

  async CreateNewProfile({ data }: { data: Partial<IBusiness> }) {
    const bs = new BusinessModel(data);
    return await bs.save();
  }
  async GetBusinesses({ limit, page }: { limit: number; page: number }) {
    return await BusinessModel.find({})
      .skip(limit * (page - 1))
      .limit(limit);
  }
  async GetBusinessById({ businessId }: { businessId: string }) {
    return await BusinessModel.findById(businessId);
  }
  async GetMyBusiness({ ownerId }: { ownerId: string }) {
    return await BusinessModel.find({ owner: ownerId });
  }
  async UpdateBusiness({
    data,
    ownerId,
  }: {
    ownerId: string;
    data: Partial<IBusiness>;
  }) {
    return await BusinessModel.findOneAndUpdate(
      { owner: ownerId, _id: data._id },
      { $set: { ...data } }
    );
  }
  async DeleteBusinness({ ownerId }: { ownerId: string }) {
    return await BusinessModel.findOneAndDelete({ owner: ownerId });
  }
}
