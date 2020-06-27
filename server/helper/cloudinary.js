const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploads = (file, folder) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(
            file,
            (result) => {
                resolve({
                    url: result.eager[1].url,
                    pic_id: result.public_id,
                });
            },

            {
                eager: [
                    { width: 600, height: 500, crop: "thumb" },
                    { width: 600, height: 500, crop: "fill" },
                ],
            },

            {
                resource_type: "auto",
                folder: folder,
            }
        );
    });
};

exports.deletes = (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(public_id, function (error, result) {
            resolve(result);
        });
    });
};
