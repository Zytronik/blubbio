import { UploadFileType } from '../_enum/uploadFileType';
import { UserSession } from '../_interface/userSession';

const host: string = window.location.hostname;
export let isLocal: boolean;
export let frontendURL: string;
export let backendURL: string;
export let socketIoHost: string;
const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

if (host === 'localhost' || ipRegex.test(host)) {
  isLocal = true;
  frontendURL = 'http://' + host + ':8080/';
  backendURL = 'http://' + host + ':3000/';
  socketIoHost = backendURL;
} else {
  isLocal = false;
  frontendURL = 'https://blubb.io/';
  socketIoHost = frontendURL;
  backendURL = 'https://blubb.io/blubbio-backend/';
}

export function getUserPbUrl(userSession: UserSession): string {
  if (userSession) {
    return (
      userSession.pbUrl ||
      require(`../../assets/img/default/pbPlaceholder.png`)
    );
  }
  return require(`../../assets/img/default/pbPlaceholder.png`);
}

export function getUserRankImgUrl(rankName: string): string {
  return require(`../../assets/img/ranks/${rankName}.png`);
}


export const UploadFileTypeUrls: Record<UploadFileType, string> = {
  [UploadFileType.PROFILE_PICTURE]: 'users/updateProfilePic',
  [UploadFileType.PROFILE_BANNER]: 'users/updateProfileBanner',
};
