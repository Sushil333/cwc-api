import { createReadStream } from 'fs';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import { unlink } from 'fs';
import fs from fs;
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

  fs.unlink(file.path, function(err) {
    if(err && err.code == 'ENOENT') {
        console.info("File doesn't exist, won't remove it.");
    } else if (err) {
        console.error("Error occurred while trying to remove file");
    } else {
        console.info(`removed`);
    }
});

  await unLinkFile(file.path);
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
