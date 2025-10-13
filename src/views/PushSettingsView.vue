<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - Settings</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.push_timeout"
            label="Push timeout"
            unit="s"
            min="10"
            max="60"
            step="1"
            width="5"
            help="The number of seconds that the device will wait until a remote service accepts the connection"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.push_resend_time"
            :label="'Push minimum resend time ' + intervalLabel"
            unit="s"
            min="10"
            max="86400"
            step="1"
            width="5"
            help="The number of seconds before a value can be resent to a push target"
            :disabled="global.disabled"
          />
        </div>
      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-3">
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'
import { storeToRefs } from 'pinia'

const intervalLabel = ref('')

const { push_resend_time } = storeToRefs(config)

watch(push_resend_time, () => {
  createIntervalLabel()
})

onMounted(() => {
  createIntervalLabel()
})

const createIntervalLabel = () => {
  const s =
    Math.floor(push_resend_time.value / 3600) +
    ' h ' +
    Math.floor((push_resend_time.value % 3600) / 60) +
    ' min ' +
    (push_resend_time.value % 60) +
    ' sec'
  intervalLabel.value = '(' + s + ')'
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
