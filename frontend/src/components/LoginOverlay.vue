<template>
  <div class="overlay login-overlay">
    <div class="overlay-container">
      <transition name="fade" mode="out-in">
        <div :key="currentFormKey">
          <form @submit.prevent="handleCheckUsername" v-show="showUsernameForm" key="username-form">
            <h2>Welcome!</h2>
            <p>Please enter your username to join.</p>
            <input type="text" id="username" placeholder="Username" v-model="formData.username" required />

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button class="primary" type="submit">Join</button>
            <button class="primary" type="button" @click="handlePlayAsGuest">
              Play as Guest
            </button>
          </form>

          <form @submit.prevent="handleRegister" v-show="showRegister" key="register-form">
            <h2>Want to join?</h2>
            <p>
              The username <strong>{{ formData.username }}</strong> hasn't been
              registered.<br>Claim it now!
            </p>
            <input type="email" id="email" placeholder="Email (Only used for PW reset)" v-model="formData.email"
              required />
            <input type="password" id="passwordRegister" placeholder="Password" v-model="formData.password" required />
            <input type="password" id="passwordRegisterAgain" placeholder="Repeat Password"
              v-model="formData.passwordAgain" required />

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button class="primary" type="submit">Register</button>
            <button class="primary" type="button" @click="backtoUsernameForm">Back</button>
          </form>

          <form @submit.prevent="handleLogin" v-show="showLogin" key="login-form">
            <h2>Good to see you again!</h2>
            <p>
              The username <strong>{{ formData.username }}</strong> is
              registered.<br>Please enter your password to log in.
            </p>
            <input type="password" id="passwordLogin" placeholder="Password" v-model="formData.password" required />

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button class="primary" type="submit">Login</button>
            <button class="primary" type="button" @click="toForgotPwForm">I Forgot</button>
            <button class="primary" type="button" @click="backtoUsernameForm">Back</button>
          </form>

          <form @submit.prevent="handleForgotPw" v-show="showForgotPw" key="forgotPw-form">
            <h2>Reset your Password</h2>
            <p>Please enter your email to reset your password.</p>
            <input type="email" id="emailForgot" placeholder="Email" v-model="formData.emailForgot" required />

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
            <button class="primary" type="submit">Send Email</button>
            <button class="primary" type="button" @click="backtoLoginForm">Back</button>
          </form>

          <form @submit.prevent="handleChangePw" v-show="showChangePw" key="changePw-form">
            <h2>Change your Password</h2>
            <p>Please enter your new password.</p>
            <input type="password" id="newPassword" placeholder="New Password" v-model="formData.newPassword"
              required />
            <input type="password" id="newPasswordAgain" placeholder="Repeat New Password"
              v-model="formData.newPasswordAgain" required />

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
            <button class="primary" type="submit">Change Password</button>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { usePageStore } from '@/stores/pageStore';
import { useToastStore } from '@/stores/toastStore';
import type { AuthResponse } from '@/ts/_interface/auth';
import {
  changePw,
  checkIfUsernameIsTakenAndValid,
  forgotPw,
  login,
  loginAsGuest,
  register,
  verifyResetToken,
} from '@/ts/network/auth';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'LoginOverlay',
  setup() {
    const showLogin = ref<boolean>(false);
    const showUsernameForm = ref<boolean>(true);
    const showRegister = ref<boolean>(false);
    const showForgotPw = ref<boolean>(false);
    const showChangePw = ref<boolean>(false);
    const token = ref<string>('');
    const isResetPasswordPath = ref<boolean>(false);
    const errorMessage = ref<string>('');

    const formData = ref({
      username: '',
      password: '',
      passwordAgain: '',
      email: '',
      emailForgot: '',
      newPassword: '',
      newPasswordAgain: '',
    });

    const currentFormKey = computed(() => {
      if (showUsernameForm.value) return 'username-form';
      if (showForgotPw.value) return 'forgotPw-form';
      if (showRegister.value) return 'register-form';
      if (showLogin.value) return 'login-form';
      if (showChangePw.value) return 'changePw-form';
      return 'default-key';
    });

    function clearForms() {
      formData.value.username = '';
      formData.value.email = '';
      formData.value.password = '';
      formData.value.passwordAgain = '';
    }

    function clearErrorMessage() {
      errorMessage.value = '';
    }

    async function handleCheckUsername() {
      const authResponse: AuthResponse = await checkIfUsernameIsTakenAndValid(
        formData.value.username,
      );
      if (authResponse.errorMsg) {
        errorMessage.value = authResponse.errorMsg;
      } else {
        if (!authResponse.success) {
          toLoginForm();
        } else {
          toRegisterForm();
        }
        clearErrorMessage();
      }
    }

    async function handlePlayAsGuest() {
      loginAsGuest(formData.value.username);
      const pageStore = usePageStore();
      pageStore.setLoginStatus(true);
    }

    async function handleRegister() {
      const username = formData.value.username;
      const password = formData.value.password;
      const authResponse: AuthResponse = await register(
        username,
        formData.value.email,
        password,
        formData.value.passwordAgain,
      );
      if (authResponse.success) {
        handleLoginLogic(username, password);
      } else {
        errorMessage.value = authResponse.errorMsg;
      }
    }

    function handleLogin() {
      handleLoginLogic(formData.value.username, formData.value.password);
    }

    async function handleLoginLogic(username: string, password: string) {
      const authResponse: AuthResponse = await login(username, password);
      if (authResponse.success) {
        const pageStore = usePageStore();
        pageStore.setLoginStatus(true);
        /* emit('joinRoomFromHash');
                emit('updateAuthenticatedState'); */
      } else {
        errorMessage.value = authResponse.errorMsg;
      }
    }

    async function handleForgotPw() {
      const authResponse: AuthResponse = await forgotPw(
        formData.value.emailForgot,
      );
      if (authResponse.success) {
        const toastStore = useToastStore();
        toastStore.showMessage('Password reset email sent.', 'success');
        toLoginForm();
        clearErrorMessage();
      } else {
        errorMessage.value = authResponse.errorMsg;
      }
    }

    async function handleChangePw() {
      const authResponse: AuthResponse = await changePw(
        token.value,
        formData.value.newPassword,
        formData.value.newPasswordAgain,
      );
      if (authResponse.success) {
        token.value = '';
        const toastStore = useToastStore();
        toastStore.showMessage('Password was changed successfully.', 'success');
        history.replaceState(null, '', '/');
        toUsernameForm();
      } else {
        errorMessage.value = authResponse.errorMsg;
      }
    }

    async function checkUrlPathAndExtractToken() {
      const currentPath = window.location.pathname;
      isResetPasswordPath.value = currentPath.includes('/reset-password');
      if (isResetPasswordPath.value) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        token.value = urlParams.get('token') ?? '';
        const authResponse: AuthResponse = await verifyResetToken(token.value);
        if (authResponse.success) {
          toChangePwForm();
        } else {
          const toastStore = useToastStore();
          toastStore.showMessage('Invalid reset token.', 'error');
        }
      }
    }

    function toLoginForm() {
      formData.value.password = '';
      formData.value.passwordAgain = '';
      showLogin.value = true;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = false;
      showChangePw.value = false;
    }

    function toRegisterForm() {
      formData.value.password = '';
      formData.value.passwordAgain = '';
      showRegister.value = true;
      showUsernameForm.value = false;
      showLogin.value = false;
      showForgotPw.value = false;
      showChangePw.value = false;
    }

    function toUsernameForm() {
      showLogin.value = false;
      showUsernameForm.value = true;
      showRegister.value = false;
      showForgotPw.value = false;
      showChangePw.value = false;
      clearErrorMessage();
    }

    function toForgotPwForm() {
      showLogin.value = false;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = true;
      showChangePw.value = false;
      clearErrorMessage();
    }

    function toChangePwForm() {
      showLogin.value = false;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = false;
      showChangePw.value = true;
      clearErrorMessage();
    }

    function backtoLoginForm() {
      showLogin.value = true;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = false;
      formData.value.password = '';
      showChangePw.value = false;
      clearErrorMessage();
    }

    function backtoUsernameForm() {
      showUsernameForm.value = true;
      showRegister.value = false;
      showLogin.value = false;
      showChangePw.value = false;
      showForgotPw.value = false;
      clearForms();
      clearErrorMessage();
    }

    onMounted(() => {
      clearErrorMessage();
      checkUrlPathAndExtractToken();
    });

    return {
      showLogin,
      showUsernameForm,
      showRegister,
      showForgotPw,
      showChangePw,
      token,
      isResetPasswordPath,
      errorMessage,
      currentFormKey,
      formData,
      handleCheckUsername,
      handlePlayAsGuest,
      handleRegister,
      handleLogin,
      handleForgotPw,
      handleChangePw,
      backtoLoginForm,
      backtoUsernameForm,
      toForgotPwForm,
    };
  },
};
</script>

<style scoped>
form button:first-of-type {
  margin-top: 15px;
}

p {
  margin-bottom: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

button+button {
  margin-top: 10px;
}

label {
  margin-bottom: 8px;
}
</style>
