import { ICMSService } from '../interfaces/ICMSService';
import { callAppsScript } from '../appsScriptClient';
import { CMSContent, CMSUpdateResponse } from '../../../views/dashboard/types/cms';

export class AppsScriptCMSAdapter implements ICMSService {
  async getCMS(): Promise<CMSContent> {
    return callAppsScript('GET_CMS', {}, 'GET');
  }

  async updateCMS(payload: CMSContent | { data: CMSContent } | { full_content: CMSContent }): Promise<CMSUpdateResponse> {
    return callAppsScript('UPDATE_CMS', payload);
  }

  async initializeCMS(payload: CMSContent | { data: CMSContent } | { full_content: CMSContent }): Promise<CMSUpdateResponse> {
    return callAppsScript('INITIALIZE_CMS', payload);
  }
}
