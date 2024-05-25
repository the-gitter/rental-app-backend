import BillModel, { IBill } from "../models/billModel";
import BillTemplatModel, { IBillTemplate } from "../models/billTemplateModel";

export default class BillsRepository {
  constructor() {
    this.CreateBill = this.CreateBill.bind(this);
    this.DeleteBillTemplate = this.DeleteBillTemplate.bind(this);
    this.GetBillById = this.GetBillById.bind(this);
    this.GetBillsForCustomer = this.GetBillsForCustomer.bind(this);
    this.GetBillsForBusiness = this.GetBillsForBusiness.bind(this);
    this.UpdateBillTemplate = this.UpdateBillTemplate.bind(this);
  }

  async CreateBill({ data }: { data: IBill }) {
    const bill = new BillModel(data);
    return await bill.save();
  }

  async GetBillsForCustomer({ customer }: { customer: string }) {
    return await BillModel.find({ customer: customer });
  }
  async GetBillsForBusiness({ businessId }: { businessId: string }) {
    return await BillModel.find({ business: businessId });
  }

  async GetBillById({ billId }: { billId: string }) {
    return await BillModel.findById(billId);
  }

  async UpdateBillTemplate({ templateId, data }: { templateId: string; data: Partial<IBill> }) {
    return await BillModel.findByIdAndUpdate(templateId, { $set: { ...data } });
  }
  async DeleteBillTemplate({ templateId }: { templateId: string }) {
    return await BillModel.findByIdAndDelete(templateId);
  }
}
