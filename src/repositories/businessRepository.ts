import BusinessModel, { IBusiness } from "../models/businessModel";

export default class BusinessRepository {
  constructor() {
    this.CreateNewProfile = this.CreateNewProfile.bind(this);
    this.DeleteBusinness = this.DeleteBusinness.bind(this);
    this.GetBusinessById = this.GetBusinessById.bind(this);
    this.GetBusinesses = this.GetBusinesses.bind(this);
    this.UpdateBusiness = this.UpdateBusiness.bind(this);
  }

  async CreateNewProfile({ data }: { data: Partial<IBusiness> }) {
    const bs = new BusinessModel(data);
    return await bs.save();
  }
  async GetBusinesses() {
    return await BusinessModel.find();
  }
  async GetBusinessById({ ownerId }: { ownerId: string }) {}
  async UpdateBusiness({
    data,
    ownerId,
  }: {
    ownerId: string;
    data: Partial<IBusiness>;
  }) {
    return await BusinessModel.findOneAndUpdate(
      { owner: ownerId },
      { $set: { ...data } }
    );
  }
  async DeleteBusinness({ ownerId }: { ownerId: string }) {
    return await BusinessModel.findOneAndDelete({ owner: ownerId });
  }
}
