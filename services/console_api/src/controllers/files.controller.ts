import {
  get,
  param,
  response
} from '@loopback/rest';
import s3Client from '../utils/s3Client';


export class FilesController {
  constructor(

  ) {}

  @get('/files/{bucket}/{key}')
  @response(200, {
    description: 'AuthClient model instance',
  })
  async getFile(
    @param.path.string('key') key: string,
    @param.path.string('bucket') bucket: string,

  ): Promise<Buffer> {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    const data = await s3Client.getObject(params).promise();
    return data.Body as Buffer;
  }


}
