import { useUserStore } from '@/stores/userStore';
import { MenuButton } from '../_interface/menuButton';
import { transitionPageForwardsAnimation } from '../cssAnimation/transitionPageForwards';
import { useSoundStore } from '@/stores/soundStore';

export function isButtonDisabled(button: MenuButton): boolean {
  const userStore = useUserStore();
  if (!userStore.userSession) {
    return false;
  }
  const currentUserID = userStore.userSession.userId;
  if (
    button.authIds &&
    (!currentUserID || !button.authIds.includes(currentUserID))
  ) {
    return true;
  }
  return false;
}

function handleMenuButtonClick(button: MenuButton) {
  transitionPageForwardsAnimation(button.page);
}

function handleMenuButtonHover() {
  useSoundStore().playSound('menu_hover');
}

export function getMenuButtonAttributes(button: MenuButton) {
  return isButtonDisabled(button)
    ? {}
    : {
        onClick: () => handleMenuButtonClick(button),
        onMouseenter: () => handleMenuButtonHover(),
      };
}
