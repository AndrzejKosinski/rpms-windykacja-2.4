export interface GetFileBlobPayload {
  fileId: string;
}

export interface UploadFilePayload {
  email: string;
  caseId: string;
  fileData: string;
  fileName: string;
  fileType: string;
  subfolderType: 'invoices' | 'legal' | 'correspondence';
}

export interface FileResponse {
  status: 'success' | 'error';
  message?: string;
  data?: string; // Base64 string data
  mimeType?: string;
  fileName?: string;
}
