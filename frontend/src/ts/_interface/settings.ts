import { AudioSettings } from '@shared/types';
import { Input } from './input';

export interface Settings {
  inputs: Input[];
  handlings: string[] | null;
  graphics: string[] | null;
  audio: AudioSettings;
}
