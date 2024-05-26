import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryRepository {
  async uploadFile(filePath: string, fileName: string, path?: string) {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `ecom/${path ? path : "user"}/${fileName}`,
    });
    console.log("File is uploaded on cloudinary", result.url);

    // deletes file
    console.log(filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }

      console.log("File deleted!");
    });
    return result;
  }

  async deleteFile(public_id: string) {
    return await cloudinary.uploader.destroy(public_id);
  }
}

export default CloudinaryRepository;
