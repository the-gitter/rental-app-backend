import UserModel, { IUser } from "../models/userModel";

export default class UserRepository {
  constructor() {
    this.DeleteUserById = this.DeleteUserById.bind(this);
    this.GetBillHistory = this.GetBillHistory.bind(this);
    this.GetUserById = this.GetUserById.bind(this);
    this.SendBillToCustomer = this.SendBillToCustomer.bind(this);
    this.UpdateUserById = this.UpdateUserById.bind(this);
  }

  async GetUserById({ uid }: { uid: string }) {
    return await UserModel.findOne({ uid });
  }
  async UpdateUserById({ uid, data }: { uid: string; data: Partial<IUser> }) {
    return await UserModel.findOneAndUpdate(
      { uid },
      {
        $set: {
          ...data,
        },
      }
    );
  }
  async GetBillHistory({ uid }: { uid: string }) {
    const data = await UserModel.findOne({ uid })
      .select("billHistory")
      .populate("billHistory");
    return data ? data?.billHistory : [];
  }
  async DeleteUserById({ uid }: { uid: string }) {
    return await UserModel.findOneAndDelete({ uid });
  }

  async SendBillToCustomer({
    billId,
    customerId,
  }: {
    billId: string;
    customerId: string;
  }) {
    return await UserModel.findByIdAndUpdate(customerId, {
      $push: {
        billHistory: billId,
      },
    });
  }
}
