import BillTemplatModel, { IBillTemplate } from "../models/billTemplateModel";

export default class BillTemplatsRepository {
  constructor() {
    this.CreateTemplate = this.CreateTemplate.bind(this);
    this.DeleteBillTemplate = this.DeleteBillTemplate.bind(this);
    this.GetBillTemplates = this.GetBillTemplates.bind(this);
    this.UpdateBillTemplate = this.UpdateBillTemplate.bind(this);
    this.GetBillTemplate = this.GetBillTemplate.bind(this);
    this.GetPublicBillTemplets = this.GetPublicBillTemplets.bind(this);
  }

  async CreateTemplate(data: Partial<IBillTemplate>) {
    const bill = new BillTemplatModel(data);
    return await bill.save();
  }

  async GetBillTemplates({ businessId }: { businessId: string }) {
    return await BillTemplatModel.find({ businessId });
  }
  async GetBillTemplate({ templateId }: { templateId: string }) {
    return await BillTemplatModel.findById(templateId);
  }
  async GetPublicBillTemplets() {
    return await BillTemplatModel.find({ visibility: "public" });
  }

  async UpdateBillTemplate({
    templateId,
    data,
  }: {
    templateId: string;
    data: Partial<IBillTemplate>;
  }) {
    return await BillTemplatModel.findByIdAndUpdate(
      templateId,
      {
        $set: { ...data },
      },
      { new: true }
    );
  }
  async DeleteBillTemplate({ templateId }: { templateId: string }) {
    return await BillTemplatModel.findByIdAndDelete(templateId);
  }
}
