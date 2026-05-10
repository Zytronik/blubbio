import { useSoundStore } from '@/stores/soundStore';
import { Settings } from '../_interface/settings';
import { allInputs } from '../input/allInputs';
import { useUserStore } from '@/stores/userStore';
import { httpClient } from '../network/httpClient';

export function saveSettings() {
  const soundStore = useSoundStore();
  const userStore = useUserStore();
  const settings: Settings = {
    inputs: allInputs,
    handlings: null,
    graphics: null,
    audio: {
      musicVolume: soundStore.musicVolume,
      sfxVolume: soundStore.sfxVolume,
    },
  };

  if (userStore.isGuest()) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  if (userStore.isUser()) {
    const userId = userStore.userSession.userId;
    if (!userId) return;

    httpClient.post(`/users/${userId}/settings`, settings);
  }
}

export async function loadSettings() {
  const soundStore = useSoundStore();
  const userStore = useUserStore();

  let settings: Settings | null = null;

  if (userStore.isGuest()) {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      settings = JSON.parse(settingsString);
    }
  }

  if (userStore.isUser()) {
    const userId = userStore.userSession.userId;
    if (!userId) return;

    const response = await httpClient.get<string>(
      `/users/${userId}/settings`,
      {
        responseType: 'text',
      }
    );

    settings = response.data
      ? JSON.parse(response.data)
      : null;

    if (response.data && response.data !== '') {
      settings = JSON.parse(response.data) as Settings;
    }
  }

  if (!settings) return;

  soundStore.setMusicVolume(settings.audio.musicVolume);
  soundStore.setSfxVolume(settings.audio.sfxVolume);

  settings.inputs.forEach(inputSetting => {
    const input = allInputs.find(i => i.name === inputSetting.name);
    if (input) {
      input.customKeyMap = inputSetting.customKeyMap;
    }
  });
}
