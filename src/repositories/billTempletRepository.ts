import BillTemplatModel, { IBillTemplate } from "../models/billTemplateModel";

export default class BillTemplatsRepository {
  constructor() {
    this.CreateTemplate = this.CreateTemplate.bind(this);
    this.DeleteBillTemplate = this.DeleteBillTemplate.bind(this);
    this.GetBillTemplates = this.GetBillTemplates.bind(this);
    this.UpdateBillTemplate = this.UpdateBillTemplate.bind(this);
    this.GetBillTemplate = this.GetBillTemplate.bind(this);
  }

  async CreateTemplate(data: IBillTemplate) {
    const bill = new BillTemplatModel(data);
    return await bill.save();
  }

  async GetBillTemplates({ businessId }: { businessId: string }) {
    return await BillTemplatModel.find({ business: businessId });
  }
  async GetBillTemplate({ templateId }: { templateId: string }) {
    return await BillTemplatModel.findById(templateId);
  }

  async UpdateBillTemplate({
    templateId,
    data,
  }: {
    templateId: string;
    data: Partial<IBillTemplate>;
  }) {
    return await BillTemplatModel.findByIdAndUpdate(templateId, {
      $set: { ...data },
    });
  }
  async DeleteBillTemplate({ templateId }: { templateId: string }) {
    return await BillTemplatModel.findByIdAndDelete(templateId);
  }
}
