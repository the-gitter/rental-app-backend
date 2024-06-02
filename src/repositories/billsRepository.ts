import BillModel, { IBill } from "../models/billModel";
import BillTemplatModel, { IBillTemplate } from "../models/billTemplateModel";

export default class BillsRepository {
  constructor() {
    this.CreateBill = this.CreateBill.bind(this);
    this.DeleteBill = this.DeleteBill.bind(this);
    this.GetBillById = this.GetBillById.bind(this);
    this.GetBillsForCustomer = this.GetBillsForCustomer.bind(this);
    this.GetBillsForBusiness = this.GetBillsForBusiness.bind(this);
    this.UpdateBill = this.UpdateBill.bind(this);
  }

  async CreateBill({ data }: { data: Partial<IBill> }) {
    const bill = new BillModel(data);
    return await bill.save();
  }

  async GetBillsForCustomer({ customer }: { customer: string }) {
    console.log(customer)
    return await BillModel.find({ customer: customer }).populate('customer').populate('business');
  }
  async GetBillsForBusiness({ businessId }: { businessId: string }) {
    return await BillModel.find({ business: businessId }).populate('customer').populate('business');
  }
  async GetBillById({ billId }: { billId: string }) {
    return await BillModel.findById(billId).populate('customer').populate('business');
  }

  async UpdateBill({ billId, data }: { billId: string; data: Partial<IBill> }) {
    return await BillModel.findByIdAndUpdate(billId, { $set: { ...data } });
  }
  async DeleteBill({ billId }: { billId: string }) {
    return await BillModel.findByIdAndDelete(billId);
  }
}
