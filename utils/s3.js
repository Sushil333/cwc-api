import { createReadStream } from 'fs';
import aws from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});


// uploads a file to s3
function uploadFile(file) {
  const fileStream = createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
const _uploadFile = uploadFile;
export { _uploadFile as uploadFile };


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
const _getFileStream = getFileStream;
export { _getFileStream as getFileStream };


// downloads a file from s3
function deleteFile(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.deleteObject(downloadParams).promise();
}
export { deleteFile }
