<template>
  <h5>Developer settings</h5>
  <div class="row gy-4">
    <div class="col-md-3">
      <button
        @click="enableCors"
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
        &nbsp;Enable CORS</button
      >&nbsp;
    </div>
  </div>
</template>

<script setup>
import { global } from '@/modules/pinia'
import { logInfo, logError, sharedHttpClient } from '@mp-se/espframework-ui-components'

const enableCors = async () => {
  global.disabled = true
  global.clearMessages()

  var data = {
    cors_allowed: true
  }

  try {
    await sharedHttpClient.postJson('api/config', data)
    global.disabled = false
    logInfo('EnableCorsFragment.enableCors()', 'Sending /api/config completed')
    global.messageSuccess = 'CORS enabled in configuration, reboot to take effect.'
  } catch (err) {
    logError('EnableCorsFragment.enableCors()', err)
    global.disabled = false
    global.messageError = 'Failed to enable CORS.'
  }
}
</script>
