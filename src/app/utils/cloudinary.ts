import { v2 as cloudinary } from "cloudinary";
import config from "../../config";

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string = "quickhire/jobs",
): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder }, (error, result) => {
                if (error || !result) {
                    return reject(error || new Error("Upload failed"));
                }
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            })
            .end(buffer);
    });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
};
