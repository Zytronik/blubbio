<template>
    <div class="tab-wrapper">
        <div class="settings-wrapper">
            <FileUploadSetting title="Change Profile Picture"
                description="The img must be less than 2MB and in jpg or png format." buttonText="Upload"
                :uploadFileType="UploadFileType.PROFILE_PICTURE" />
            <FileUploadSetting title="Change Profile Banner"
                description="We recommend the following img dimensions: 1920px x 170px" buttonText="Upload"
                :uploadFileType="UploadFileType.PROFILE_BANNER" />
            <ButtonSetting title="Log out of Account" description="Logs the User out of the Account"
                buttonText="Log out" :action="logUserOut" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonSetting from '@/components/settings/ButtonSetting.vue';
import FileUploadSetting from '@/components/settings/FileUploadSetting.vue';
import { logUserOut } from '@/ts/network/auth';
import { UploadFileType } from '@/ts/_enum/uploadFileType';

export default defineComponent({
    name: 'AccountSettingsTab',
    components: { ButtonSetting, FileUploadSetting },
    setup() {
        return {
            logUserOut,
            UploadFileType,
        };
    },
});
</script>