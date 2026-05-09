import { AudioSettings } from './audioSettings';
import { Input } from './input';

export interface Settings {
  inputs: Input[];
  handlings: string[] | null;
  graphics: string[] | null;
  audio: AudioSettings;
}
