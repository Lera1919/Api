const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3 } = require("@aws-sdk/client-s3");
const { read } = require('fs');

const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Настройки подключения к амазоновскому серверу S3
const s3 = new S3({
    endpoint: process.env.AWS_HOST,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
    sslEnabled: false,
    forcePathStyle: true
});

const s3Storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const fileName = `${req.user.id}/${file.fieldname}/` + uuidv4() + path.extname(file.originalname.toLowerCase());
        cb(null, fileName);
    },
});

const sanitizeFile = (file, cb) => {

    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {
        cb("Error: Запрещенный тип файла!");
    }
};

const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    },
});

module.exports = uploadImage;