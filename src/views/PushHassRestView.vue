<template>
  <div class="container">
    <p></p>
    <p class="h3">Integration - Home Assistant (REST API)</p>

    <p>Only one Home Assistant integration will be enabled and MQTT is enabled when MQTT target is defined.</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post_target"
            maxlength="120"
            label="Base Url"
            help="Name of server to connect to, use url"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-12">
          <BsInputText
            v-model="config.http_post_header2"
            type="text"
            maxlength="300"
            label="Authorization header"
            help="Format should be Authorization: Bearer <Home Assistant long lived access token>"
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
  if (!validateCurrentForm()) return

  if(config.http_post_target != "" && !config.http_post_target.endsWith("/"))
    config.http_post_target += "/"
  
  global.clearMessages()

  if(!config.http_post_header2.startsWith("Authorization: Bearer")) {
    global.messageError = "Invalid format for Authorization header, needs to start with 'Authorization: Bearer'"
    return
  }

  config.saveAll()
}
</script>
