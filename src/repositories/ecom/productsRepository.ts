import mongoose from "mongoose";
import ProductModel, { IProduct } from "../../models/ecom/ProductsModel";

class ProductRepository {
  async createProduct(data: Partial<IProduct>) {
    const product = new ProductModel(data);
    await product.save();
    return product;
  }

  async editProduct(id: string, data: Partial<IProduct>) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteProduct(id: string) {
    return ProductModel.findByIdAndDelete(id).exec();
  }

  async getAllProducts() {
    return ProductModel.find().populate("variants").exec();
  }

  async getProductById(id: string) {
    return ProductModel.findById(id).populate("variants").exec();
  }
  async deleteProductImage(id: string) {
    return ProductModel.findByIdAndUpdate(id, {
      $unset: {
        image: null,
      },
    });
  }
}

export default ProductRepository;
