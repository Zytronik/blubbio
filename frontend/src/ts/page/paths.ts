import { GetUserProfileResponseDto } from '../_dto/get-user-profile.response.dto';
import { UploadFileType } from '../_enum/uploadFileType';

const host: string = window.location.hostname;
export let isLocal: boolean;
export let frontendURL: string;
export let backendURL: string;
export let socketIoHost: string;
export let socketIoPath: string;
const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

if (host === 'localhost' || ipRegex.test(host)) {
  isLocal = true;
  frontendURL = 'http://' + host + ':8080/';
  backendURL = 'http://' + host + ':3000/';
  socketIoHost = backendURL;
  socketIoPath = "/socket.io";
} else {
  isLocal = false;
  frontendURL = 'https://blubb.io/';
  socketIoHost = frontendURL;
  backendURL = 'https://blubb.io/blubbio-backend/';
  socketIoPath = '/blubbio-backend/socket.io';
}

export function getUserPbUrl(userProfile: GetUserProfileResponseDto): string {
  if (userProfile) {
    return (
      userProfile.pbUrl ||
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
