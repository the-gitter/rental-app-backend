import CategoryModel, { ICategory } from "../../models/ecom/CategoryModel";

class CategoryRepository {
  constructor() {
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.getCategoriesWithSubcategories = this.getCategoriesWithSubcategories.bind(
      this
    );
    this.getSubcategories = this.getSubcategories.bind(this);
  }

  async get() {
    return await this.getCategoriesWithSubcategories();
  }

  async getById({ id, userId }: { id: string; userId: string }) {
    return await CategoryModel.findOne({ _id: id, user: userId }).exec();
  }

  async getSubcategories(categoryId: string): Promise<any> {
    const subcategories = await CategoryModel.find({
      parent: categoryId,
    }).exec();
    const subcategoriesWithChildren = await Promise.all(
      subcategories.map(async (subcategory) => {
        const children = await this.getSubcategories(
          subcategory._id.toString()
        );
        return { ...subcategory.toObject(), children };
      })
    );
    return subcategoriesWithChildren;
  }

  async getCategoriesWithSubcategories() {
    const categories = await CategoryModel.find({ parent: null }).exec();
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await this.getSubcategories(
          category._id.toString()
        );
        return { ...category.toObject(), subcategories };
      })
    );
    return categoriesWithSubcategories;
  }

  async create({ userId, data }: { userId: string; data: Partial<ICategory> }) {
    const category = new CategoryModel({ ...data, user: userId });
    await category.save();
    return category;
  }

  async edit({
    id,
    userId,
    data,
  }: {
    id: string;
    userId: string;
    data: Partial<ICategory>;
  }) {
    return await CategoryModel.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: data },
      { new: true }
    ).exec();
  }
}

export default CategoryRepository;
