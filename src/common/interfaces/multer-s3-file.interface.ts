import { S3 } from 'aws-sdk';
import { File } from 'multer';

export interface MulterS3File extends File {
  location: string; 
  key: string;      
  bucket: string;
  etag: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  s3: S3;
  buffer: any
}