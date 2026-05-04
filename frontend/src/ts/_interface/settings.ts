import { AudioSettings } from './audioSettings';
import { Input } from './input';

export interface Settings {
  inputs: Input[];
  handlings: String[] | null;
  graphics: String[] | null;
  audio: AudioSettings;
}
