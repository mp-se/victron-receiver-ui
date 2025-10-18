<template>
  <div class="container">
    <p></p>
    <p class="h3">Integration - Home Assistant (REST API)</p>

    <p class="fs-6">
      Only one Home Assistant integration will be enabled at any time. MQTT is prioritized and
      targets are enabled when a Url / Server is defined. The needed token can be created under your
      personal settings page in Home Assistant, just select the Security tab on the top.
    </p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post_target"
            maxlength="120"
            label="Base Url"
            placeholder="Example: http://192.168.1.98:8123/"
            help="Name of server to connect to, use url"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-12">
          <BsInputTextArea
            @keypress="updateToken()"
            v-model="token"
            type="text"
            placeholder="Token is created in Home Assistant and is around 200 chars long"
            maxlength="300"
            label="Long lived Home Assistant Token"
            help="Paste the long lived authorization token here."
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
import { ref } from 'vue'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'

const token = ref(config.http_post_header2.replace('Authorization: Bearer ', ''))

const updateToken = () => {
  config.http_post_header2 = 'Authorization: Bearer ' + token.value
}

const save = async () => {
  if (!validateCurrentForm()) return

  if (config.http_post_target != '' && !config.http_post_target.endsWith('/'))
    config.http_post_target += '/'

  global.clearMessages()

  if (!config.http_post_header2.startsWith('Authorization: Bearer')) {
    global.messageError =
      "Invalid format for Authorization header, needs to start with 'Authorization: Bearer'"
    return
  }

  await config.saveAll()
}
</script>
