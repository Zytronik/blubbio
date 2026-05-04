<template>
    <div class="setting fileUpload-setting">
        <div class="text">
            <h3>{{ title }}</h3>
            <p class="dsc">{{ description }}</p>
        </div>
        <div class="keys">
            <button class="actionBtn secondary" @click="triggerFileUpload">{{ buttonText }}</button>
            <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
        </div>
    </div>
</template>

<script lang="ts">
import { UploadFileType } from '@/ts/_enum/uploadFileType';
import { uploadFile } from '@/ts/network/fileUploads';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'FileUploadSetting',
    props: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        buttonText: {
            type: String,
            required: true,
        },
        uploadFileType: {
            type: String as PropType<UploadFileType>,
            required: true,
        },
    },
    methods: {
        triggerFileUpload() {
            const fileInput = this.$refs.fileInput as HTMLInputElement;
            if (fileInput) {
                fileInput.click();
            }
        },
        async handleFileChange(event: Event) {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (file) {
                try {
                    await uploadFile(file, this.uploadFileType);
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        },
    },
});
</script>

<style scoped>
.keys {
    justify-content: flex-end;
}
</style>
