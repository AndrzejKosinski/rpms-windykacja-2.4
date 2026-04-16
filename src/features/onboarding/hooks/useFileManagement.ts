import { useRef } from 'react';
import { useOnboardingContext } from '../ui/OnboardingContext';
import { getFileFingerprint } from '../utils/invoiceHelpers';
import { QueueItem } from '../ui/types';
import { logCustomEvent } from '../../../utils/customLogger';

export const useFileManagement = () => {
  const { fileQueue, setFileQueue, setData, setStep, setDragActive } = useOnboardingContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    const duplicates: string[] = [];
    const newQueueItems: QueueItem[] = [];

    filesArray.forEach(f => {
      const fp = getFileFingerprint(f);
      const isDuplicate = fileQueue.some(item => item.id === fp);

      if (isDuplicate) {
        newQueueItems.push({
          id: `${fp}-dup-${Date.now()}`, // unique ID for the duplicate entry
          file: f,
          status: 'duplicate',
          error: 'Ten plik został już dodany.',
          isDuplicate: true
        });
      } else {
        newQueueItems.push({
          id: fp,
          file: f,
          status: 'queued'
        });
      }
    });

    if (newQueueItems.length > 0) {
      setFileQueue(prev => [...prev, ...newQueueItems]);
      setData(prev => ({ ...prev, isManual: false, priorityAccount: false }));
      setStep('file_management');
    }
  };

  const handleRemoveFile = (id: string) => {
    setFileQueue(prev => prev.filter(it => it.id !== id));
  };

  const handleEntryFileSelect = () => {
    logCustomEvent({ event_name: 'onboarding_choice_made', metadata: { choice: 'upload_file' } });
    if (fileQueue.length > 0) {
      setData(prev => ({ ...prev, isManual: false, priorityAccount: false }));
      setStep('file_management');
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  return {
    fileInputRef,
    handleFilesAdded,
    handleRemoveFile,
    handleEntryFileSelect,
    handleDrag,
    handleDrop
  };
};
