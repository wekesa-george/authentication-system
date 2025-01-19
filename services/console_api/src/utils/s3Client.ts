import {S3} from "aws-sdk";
import "dotenv/config";

let conf: any = {
  endpoint: process.env.LACE_CLUB_S3,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.LINODE_API_KEY,
    secretAccessKey: process.env.LINODE_API_SECRET,
  }
}
const s3Client: any = new S3(conf);

export default s3Client;
