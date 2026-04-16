import { CMSContent, CMSUpdateResponse } from '../../../views/dashboard/types/cms';

export interface ICMSService {
  getCMS(): Promise<CMSContent>;
  updateCMS(payload: CMSContent | { data: CMSContent } | { full_content: CMSContent }): Promise<CMSUpdateResponse>;
  initializeCMS(payload: CMSContent | { data: CMSContent } | { full_content: CMSContent }): Promise<CMSUpdateResponse>;
}
