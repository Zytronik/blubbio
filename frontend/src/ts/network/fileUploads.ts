import { useToastStore } from '@/stores/toastStore';
import { UploadFileType } from '../_enum/uploadFileType';
import { httpClient } from './httpClient';
import { UploadFileTypeUrls } from '../page/paths';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

export async function uploadFile(
  file: File,
  fileType: UploadFileType,
): Promise<void> {
  const toastStore = useToastStore();
  const userStore = useUserStore();

  const userId = userStore.userProfile?.uid;

  if (!userId) {
    toastStore.showMessage('User not authenticated', 'error');
    throw new Error('Missing userId');
  }

  const uploadUrlFactory = UploadFileTypeUrls[fileType];

  if (!uploadUrlFactory) {
    toastStore.showMessage('Invalid upload type', 'error');
    throw new Error('Invalid upload type');
  }

  const uploadUrl = uploadUrlFactory(userId);

  const formData = new FormData();
  formData.append('file', file);

  try {
    await httpClient.post(uploadUrl, formData);
    toastStore.showMessage('File uploaded successfully!', 'success');
    userStore.fetchUserProfile();
  } catch (error) {
    let errorMsg = 'Error uploading file';

    if (axios.isAxiosError(error)) {
      const backendMsg = error.response?.data?.message;
      if (Array.isArray(backendMsg)) {
        errorMsg = backendMsg[0];
      } else if (typeof backendMsg === 'string') {
        errorMsg = backendMsg;
      }
    } else {
      errorMsg = 'An unknown error occurred';
    }

    toastStore.showMessage(errorMsg, 'error');
    console.error('Error during file upload:', error);
    throw error;
  }
}

//USE AXIOS/BACKENDERROR MESSAGES
