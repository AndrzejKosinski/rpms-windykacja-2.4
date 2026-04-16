import { IFileService } from '../interfaces/IFileService';
import { callAppsScript } from '../appsScriptClient';
import { GetFileBlobPayload, UploadFilePayload, FileResponse } from '../../types/file';

export class AppsScriptFileAdapter implements IFileService {
  async getFileBlob(payload: GetFileBlobPayload): Promise<FileResponse> {
    return callAppsScript('GET_FILE_BLOB', payload);
  }

  async uploadFile(payload: UploadFilePayload): Promise<FileResponse> {
    return callAppsScript('UPLOAD_FILE', payload);
  }
}
