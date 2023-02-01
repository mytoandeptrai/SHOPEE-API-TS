import fs from 'fs';
import randomstring from 'randomstring';
import { cloudinary_v2 } from 'resources/cloudinary';
import { FileType } from 'utils/rest/file';
export class CloudinaryUpload {
  public async uploads(file: FileType | undefined, type?: string): Promise<any> {
    if (file === undefined) return;

    /** __dirname === '../../uploads
     * vd: D:\Shopee-api-ts\src\utils\uploads
     */
    const fileName = file.name;
    const uploadPath = __dirname + `../../uploads/${type === 'image' ? 'images' : 'videos'}` + fileName;
    const mimetype = file.mimetype && file.mimetype.includes('video');

    if (type !== 'auto' && mimetype) {
      return {
        error: 'type_error',
      };
    }

    try {
      const random_id = randomstring.generate();

      await file.mv(uploadPath);

      /**
       *  Resource_type defaults: image for server-side uploading and auto for client-side uploading.
       *  Valid values: image, raw, video and auto.
       */

      const fileNameOnCloudinary = `${fileName}-${random_id}`;

      const images_options = {
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        public_id: `shopee/images/${fileNameOnCloudinary}`,
      };

      const auto_options = {
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        chunk_size: 6000000,
        public_id: `shopee/videos/${fileNameOnCloudinary}`,
      };

      const options = type === 'auto' ? auto_options : images_options;

      const result = await cloudinary_v2.uploader.upload(uploadPath, options);
      await fs.unlinkSync(uploadPath);

      return result;
    } catch (error) {
      await fs.unlinkSync(uploadPath);
      return error;
    }
  }
}
