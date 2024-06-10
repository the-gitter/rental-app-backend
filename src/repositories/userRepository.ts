import { Types } from "mongoose";
import AddressModel, { IAddress } from "../models/addressModel";
import UserModel, { IUser } from "../models/userModel";

export default class UserRepository {
  constructor() {
    this.DeleteUserById = this.DeleteUserById.bind(this);
    // this.GetBillHistory = this.GetBillHistory.bind(this);
    this.GetUserById = this.GetUserById.bind(this);
    this.GetUsers = this.GetUsers.bind(this);
    // this.SendBillToCustomer = this.SendBillToCustomer.bind(this);
    this.UpdateUserById = this.UpdateUserById.bind(this);

    this.CreateAddress = this.CreateAddress.bind(this);
    this.DeleteAddress = this.DeleteAddress.bind(this);
    this.UpdateAddress = this.UpdateAddress.bind(this);
    this.addUserRole = this.addUserRole.bind(this);
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
  async addUserRole({ userId, role }: { userId: string; role: string }) {
    return await UserModel.findByIdAndUpdate(userId, {
      $push: {
        role: role,
      },
    });
  }
  async removeUserRole({ userId, role }: { userId: string; role: string }) {
    return await UserModel.findByIdAndUpdate(userId, {
      $pull: {
        role: role,
      },
    });
  }
  async SearchUsers({
    email,
    name,
    phone_number,
  }: {
    email?: string;
    name?: string;
    phone_number?: string;
  }) {
    const query: any = {};

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }
    if (phone_number) {
      query.phone_number = { $regex: phone_number, $options: "i" };
    }

    if (name) {
      query.$or = [
        { first_name: { $regex: name, $options: "i" } },
        { last_name: { $regex: name, $options: "i" } },
      ];
    }

    return await UserModel.find(query);
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
  // async GetBillHistory({ userId }: { userId: string }) {
  //   return await UserModel.findById(userId).populate("addbillHistoryress");
  //   // .select("billHistory")
  //   // .populate("billHistory");
  //   // return data?.billHistory;
  // }
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
