<template>
  <div class="container">
    <p></p>
    <p class="h3">Links and device logs</p>
    <hr />
    <div class="row">
      <p>
        If you need support, want to discuss the software or request any new features you can do
        that on github.com.
      </p>
    </div>
    <div class="row">
      <div class="col-md-4">
        <a
          class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
          href="https://github.com/mp-se/victron-receiver"
          target="_blank"
          >Report issues on github.com</a
        >
      </div>
    </div>

    <hr />
    <div class="row">
      <div class="col">
        <p>
          Platform: <span class="badge bg-secondary">{{ status.platform }}</span> Firmware:
          <span class="badge bg-secondary">{{ status.app_ver }} ({{ status.app_build }})</span> User
          interface:
          <span class="badge bg-secondary">{{ global.uiVersion }} ({{ global.uiBuild }})</span>
        </p>
      </div>
    </div>
    <hr />

    <div class="row">
      <div class="col-md-12">
        <button @click="viewLogs" type="button" class="btn btn-primary" :disabled="global.disabled">
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            :hidden="!global.disabled"
          ></span>
          &nbsp;View device logs</button
        >&nbsp;

        <button
          @click="removeLogs"
          type="button"
          class="btn btn-secondary"
          :disabled="global.disabled"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            :hidden="!global.disabled"
          ></span>
          &nbsp;Erase device logs
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <p></p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <pre>{{ logData }}</pre>
      </div>
      <div class="form-text">Starts with the latest log entry first.</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { status, config, global } from '@/modules/pinia'
import { logDebug } from '@mp-se/espframework-ui-components'

const logData = ref('')

async function fetchLog(file) {
  const data = {
    command: 'get',
    file: file
  }

  const result = await config.sendFilesystemRequest(data)
  if (result.success) {
    logDebug('SupportView.fetchLog()', 'Fetching ' + file + ' completed')
    const list = result.text.split('\n')
    list.forEach(function (item) {
      if (item.length) logData.value = item + '\n' + logData.value
    })
    return true
  } else {
    return false
  }
}

async function removeLog(file) {
  const data = {
    command: 'del',
    file: file
  }

  const result = await config.sendFilesystemRequest(data)
  return result.success
}

async function viewLogs() {
  global.clearMessages()
  global.disabled = true
  logData.value = ''

  await fetchLog('/error2.log')
  await fetchLog('/error.log')
  global.disabled = false
}

async function removeLogs() {
  global.clearMessages()
  global.disabled = true
  logData.value = ''

  await removeLog('/error2.log')
  await removeLog('/error.log')
  global.messageSuccess = 'Requested logs to be deleted'
  global.disabled = false
}
</script>
