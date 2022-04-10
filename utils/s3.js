import { createReadStream, unlink } from 'fs';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import util from 'util';

const unLinkFile = util.promisify(unlink);

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
async function uploadFile(file) {
  const fileStream = createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  const aws_res = await s3.upload(uploadParams).promise();
  // await unLinkFile(file.path);
  return aws_res;
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
export { deleteFile };
