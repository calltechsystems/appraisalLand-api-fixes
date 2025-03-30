import AWS from 'aws-sdk';
import toast from 'react-hot-toast';

const AWS_Cred = {
    AccessKeyId: process.env.NEXT_PUBLIC_AWS_API_KEY,
    SecretKey: process.env.NEXT_PUBLIC_AWS_API_SECRET,
    Region: process.env.NEXT_PUBLIC_AWS_BUCKET,
    bucketName: process.env.NEXT_PUBLIC_AWS_REGION
};

AWS.config.update({
    accessKeyId: AWS_Cred.AccessKeyId,
    secretAccessKey: AWS_Cred.SecretKey,
    region: AWS_Cred.Region,
});

const S3_BUCKET = AWS_Cred.bucketName;
const REGION = AWS_Cred.Region;
const myBucket = new AWS.S3({ params: { Bucket: S3_BUCKET }, region: REGION });

export async function uploadFile(file) {
    console.log("AWS_Cred", AWS_Cred, file);

    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: file.name,
        ContentType: 'image/jpeg',
        ContentDisposition: 'inline'
    };

    try {
        const data = await myBucket.putObject(params).promise();
        const S3_URL = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(file.name)}`;
        console.log("S3_URL", S3_URL);
        return S3_URL;
    } catch (error) {
        console.log("errorr", error);
        toast.error("Error while uploading!!");
        throw error; // Rethrow the error to handle it at a higher level if necessary
    }
}

