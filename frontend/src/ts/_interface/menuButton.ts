import { PAGE } from '../_enum/page';

export interface MenuButton {
  iconSrc: string;
  title: string;
  desc: string;
  page: PAGE;
  bigButton: boolean;
  authIds?: string[];
}
