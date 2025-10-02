<template>
  <div class="container">
    <p></p>
    <p class="h3">Backup & Restore</p>
    <hr />

    <div class="row">
      <div class="col-md-12">
        <p>Create a backup of the device configuration and store this in a textfile</p>
      </div>

      <div class="col-md-12">
        <button
          @click="backup"
          type="button"
          class="btn btn-primary w-2"
          data-bs-toggle="tooltip"
          :disabled="global.disabled"
        >
          Create backup
        </button>
      </div>

      <div class="col-md-12">
        <hr />
      </div>

      <div class="col-md-12">
        <p>Restore a previous backup of the device configuration by uploading it.</p>
      </div>
    </div>

    <div class="row">
      <form @submit.prevent="restore">
        <div class="col-md-12">
          <BsFileUpload
            name="upload"
            id="upload"
            label="Select backup file"
            accept=".txt"
            :disabled="global.disabled"
          >
          </BsFileUpload>
        </div>

        <div class="col-md-3">
          <p></p>
          <button
            type="submit"
            class="btn btn-primary"
            value="upload"
            data-bs-toggle="tooltip"
            title="Upload the configuration to the device"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Restore
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
import { ref } from 'vue'
import { global, config, getConfigChanges } from '@/modules/pinia'
import { logDebug, logError } from '@/modules/logger'
import { saveAs } from '@/modules/utils'

const progress = ref(0)

function backup() {
  const backup = {
    meta: { version: '0.3.0', software: 'VictronReceiver', created: '' },
    config: JSON.parse(config.toJson())
  }

  backup.meta.created = new Date().toISOString().slice(0, 10)

  logDebug('BackupView.backup()', backup)

  const s = JSON.stringify(backup, null, 2)
  const name = config.mdns + '.txt'
  saveAs(s, name, 'text/plain')
  global.messageSuccess = 'Backup file created and downloaded as: ' + name
}

function restore() {
  const fileElement = document.getElementById('upload')

  if (fileElement.files.length === 0) {
    global.messageFailed = 'You need to select one file to restore configuration from'
  } else {
    global.disabled = true
    logDebug('BackupView.restore()', 'Selected file: ' + fileElement.files[0].name)
    const reader = new FileReader()
    reader.addEventListener('load', function (e) {
      let text = e.target.result
      try {
        const data = JSON.parse(text)
        if (data.meta.software === 'VictronReceiver' && data.meta.version === '0.3.0') {
          doRestore(data.config)
        } else {
          global.messageFailed = 'Unknown format, unable to process'
        }
      } catch (error) {
        logError('BackupView.restoreSettings()', error, {
          fileName: fileElement.files[0]?.name || 'unknown',
          fileSize: fileElement.files[0]?.size || 0
        })
        global.messageFailed = 'Unable to parse configuration file for VictronReceiver.'
      }
    })
    reader.readAsText(fileElement.files[0])
  }
}

function doRestore(json) {
  for (const k in json) {
    config[k] = json[k]
  }

  getConfigChanges()
  config.saveAll()
}
</script>
