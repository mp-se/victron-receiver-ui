<template>
  <div class="container">
    <p></p>
    <p class="h3">Integration - Home Assistant (MQTT)</p>

    <p class="fs-6">
      Only one Home Assistant integration will be enabled at any time. MQTT is prioritized and
      targets are enabled when a Url / Server is defined.
    </p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.mqtt_target"
            maxlength="120"
            placeholder="Example: 192.168.1.99"
            label="Server"
            help="Name of server to connect to, use format servername.com"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsInputNumber
            v-model="config.mqtt_port"
            label="Port"
            placeholder="Typical: 1883"
            min="0"
            max="65535"
            help="Port number, 1883 is standard. Ports above 8000 means SSL"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.mqtt_user"
            maxlength="20"
            label="User name"
            help="Username to use. Leave blank if authentication is disabled"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.mqtt_pass"
            type="password"
            maxlength="20"
            label="Password"
            help="Password to use. Leave blank if authentication is disabled"
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
import { validateCurrentForm } from '@/modules/utils'
import { global, config } from '@/modules/pinia'

const save = () => {
  if (config.mqtt_target.startsWith('http://')) {
    global.messageError = 'MQTT target looks like an URL and not servername/ip.'
    return
  }

  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
