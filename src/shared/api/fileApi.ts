import { fileService } from './apiClientFactory';

export const fileApi = {
  downloadFile: async (fileUrl: string, invoiceId: string, setIsDownloading: (id: string | null) => void) => {
    const match = fileUrl.match(/\/d\/([^\/]+)/);
    const fileId = match ? match[1] : null;
    if (!fileId) return;

    setIsDownloading(invoiceId);
    try {
      const result = await fileService.getFileBlob({ fileId });
      
      if (result.status === 'success' && result.data) {
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: result.mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.fileName || `Faktura_${invoiceId}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(null);
    }
  }
};
