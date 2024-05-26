import { Types } from "mongoose";
import AddressModel, { IAddress } from "../models/addressModel";
import UserModel, { IUser } from "../models/userModel";

export default class UserRepository {
  constructor() {
    this.DeleteUserById = this.DeleteUserById.bind(this);
    this.GetBillHistory = this.GetBillHistory.bind(this);
    this.GetUserById = this.GetUserById.bind(this);
    this.GetUsers = this.GetUsers.bind(this);
    // this.SendBillToCustomer = this.SendBillToCustomer.bind(this);
    this.UpdateUserById = this.UpdateUserById.bind(this);

    this.CreateAddress = this.CreateAddress.bind(this);
    this.DeleteAddress = this.DeleteAddress.bind(this);
    this.UpdateAddress = this.UpdateAddress.bind(this);
  }
  async CreateAddress(add: Partial<IAddress>) {
    const addr = new AddressModel(add);
    return await addr.save();
  }
  async UpdateAddress({
    add,
    addId,
  }: {
    addId: Types.ObjectId;
    add: Partial<IAddress>;
  }) {
    return await AddressModel.findByIdAndUpdate(addId, { $set: { ...add } });
  }
  async DeleteAddress(addId: Types.ObjectId) {
    return await AddressModel.findByIdAndDelete(addId);
  }
  async GetUserById({ userId }: { userId: string }) {
    return await UserModel.findById(userId).populate("address");
  }
  async GetUsers() {
    return await UserModel.find().populate("address");
  }
  async UpdateUserById({
    userId,
    data,
  }: {
    userId: string;
    data: Partial<IUser>;
  }) {
    return await UserModel.findByIdAndUpdate(userId, {
      $set: {
        ...data,
      },
    }).populate("address");
  }
  async GetBillHistory({ userId }: { userId: string }) {
    return await UserModel.findById(userId).populate("addbillHistoryress");
    // .select("billHistory")
    // .populate("billHistory");
    // return data?.billHistory;
  }
  async DeleteUserById({ uid }: { uid: string }) {
    return await UserModel.findOneAndDelete({ uid });
  }

  // async SendBillToCustomer({
  //   billId,
  //   customerId,
  // }: {
  //   billId: string;
  //   customerId: string;
  // }) {
  //   return await UserModel.findByIdAndUpdate(customerId, {
  //     $push: {
  //       billHistory: billId,
  //     },
  //   });
  // }
}
