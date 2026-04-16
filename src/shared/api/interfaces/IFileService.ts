import { GetFileBlobPayload, UploadFilePayload, FileResponse } from '../../types/file';

export interface IFileService {
  getFileBlob(payload: GetFileBlobPayload): Promise<FileResponse>;
  uploadFile(payload: UploadFilePayload): Promise<FileResponse>;
}
