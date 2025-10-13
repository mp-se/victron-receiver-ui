<template>
  <div class="container">
    <p></p>
    <p class="h3">Firmware Upload</p>
    <hr />

    <div class="row">
      <form @submit.prevent="upload">
        <div style="col-md-12">
          <p>
            Selet the firmware file that matches your device. Platform:
            <span class="badge bg-secondary">{{ status.platform }}</span>
            , Version: <span class="badge bg-secondary">{{ status.app_ver }}</span> ({{
              status.app_build
            }})
          </p>
        </div>

        <div class="col-md-12">
          <BsFileUpload
            name="upload"
            id="upload"
            label="Select firmware file"
            accept=".bin"
            help="Choose the firmware file that will be used to update the device"
            :disabled="global.disabled"
          >
          </BsFileUpload>
        </div>

        <div class="col-md-3">
          <p></p>
          <button
            type="submit"
            class="btn btn-primary"
            id="upload-btn"
            value="upload"
            data-bs-toggle="tooltip"
            title="Update the device with the selected firmware"
            :disabled="global.disabled || !hasFile"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Flash firmware
          </button>
        </div>

        <div v-if="progress > 0" class="col-md-12">
          <p></p>
          <BsProgress :progress="progress"></BsProgress>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { global, status } from '@/modules/pinia'
import { logDebug, logError, sharedHttpClient } from '@mp-se/espframework-ui-components'

const progress = ref(0)
const hasFile = ref(false)

function onFileChange(event) {
  const files = event.target.files
  hasFile.value = files && files.length > 0
}

onMounted(() => {
  // Set up direct event listener for file input
  const fileElement = document.getElementById('upload')
  if (fileElement) {
    fileElement.addEventListener('change', onFileChange)
  }
})

function upload() {
  const fileElement = document.getElementById('upload')

  // Update file state in case the change event didn't fire
  hasFile.value = fileElement.files.length > 0

  if (fileElement.files.length === 0) {
    global.messageFailed = 'You need to select one file with firmware to upload'
  } else {
    global.disabled = true
    logDebug('FirmwareView.upload()', 'Selected file: ' + fileElement.files[0].name)

    const fileData = new FormData()
    fileData.append('file', fileElement.files[0])

    sharedHttpClient.uploadFile('api/firmware', fileData, {
      timeoutMs: 1000 * 180, // 180 s
      onProgress: (percent) => {
        progress.value = percent
      }
    }).then(result => {
      progress.value = 100
      if (result.success) {
        global.messageSuccess =
          'File upload completed, waiting for device to restart before doing refresh!'
        global.messageFailed = ''
      } else {
        logError('FirmwareView.upload()', `Upload failed with status ${result.status}`)
        global.messageFailed = 'File upload failed!'
      }
      global.disabled = false
      setTimeout(() => {
        location.href = location.href.replace('/other/firmware', '')
      }, 10000)
    }).catch(err => {
      logError('FirmwareView.upload()', err)
      global.messageFailed = 'File upload failed!'
      global.disabled = false
    })
  }
}
</script>
