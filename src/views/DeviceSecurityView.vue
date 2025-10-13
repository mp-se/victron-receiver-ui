<template>
  <div class="container">
    <p></p>
    <p class="h2">Device - Security</p>

    <p class="fs-6">
      Here you register your victron devices and the decryption key which can be found in the
      Victron APP. The assigned name will be used when sending data to Home Assistant. Currently up
      to 8 devices can be defined, if you need more, then open a issue on github.
    </p>
    <hr />

    <form @submit.prevent="saveSettings" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-3">
          <label class="form-label fw-bold">Name</label>
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold">Mac</label>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Decryption key</label>
        </div>
      </div>

      <div class="row" v-for="(device, index) in config.victron_config" :key="index">
        <div class="col-md-3 gy-2">
          <input
            class="form-control"
            type="text"
            v-model="config.victron_config[index].name"
            maxlength="20"
            :disabled="global.disabled"
            :class="checkName(config.victron_config[index].name) ? '' : 'is-invalid'"
          />
        </div>
        <div class="col-md-3 gy-2">
          <input
            class="form-control"
            type="text"
            v-model="config.victron_config[index].mac"
            maxlength="17"
            placeholder="XX:XX:XX:XX:XX:XX"
            :disabled="global.disabled"
            :class="checkMac(config.victron_config[index].mac) ? '' : 'is-invalid'"
          />
        </div>
        <div class="col-md-6 gy-2">
          <input
            class="form-control"
            type="text"
            v-model="config.victron_config[index].key"
            maxlength="32"
            :disabled="global.disabled"
            :class="checkKey(config.victron_config[index].key) ? '' : 'is-invalid'"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <div class="form-text">
            Unique name of the device used to identify it in Home Assistant.
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-text">
            Paste the mac adress from the victron app, press save to validate and format the name.
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-text">
            Paste the encryption key from the Victron app, should be 32 chars.
          </div>
        </div>
      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-12">
          <button type="submit" class="btn btn-primary w-2" :disabled="global.disabled">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;

          <button
            @click="restart()"
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
            &nbsp;Restart device</button
          >&nbsp;

          <button
            @click="factory"
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
            &nbsp;Restore factory defaults
          </button>
        </div>

        <div class="col-sm-12">
          <p>Press save and the mac adress will be validated and formatted.</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'
import { logDebug } from '@mp-se/espframework-ui-components'

function checkName(name) {
  if (name.length == 0) {
    return true
  } else {
    const regex = new RegExp('^[A-Za-z0-9_]+$')
    return regex.test(name)
  }
}

function checkKey(key) {
  if (key.length == 0) {
    return true
  } else {
    const regex = new RegExp('^([0-9a-fA-F]){32}$', 'gm')
    return regex.test(key)
  }
}

function checkMac(mac) {
  if (mac.length == 0) {
    return true
  } else {
    const regex = new RegExp('^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$', 'gm')
    return regex.test(mac)
  }
}

const saveSettings = () => {
  var valid = true

  config.victron_config.forEach((e) => {
    // Format the values in the mac adress format and then do the final validation
    e.mac = (
      e.mac
        .toUpperCase()
        .replace(/[^\d|A-Z]/g, '')
        .match(/.{1,2}/g) || []
    ).join(':')
    e.key = e.key.toUpperCase()

    if (!checkKey(e.key)) valid = false
    if (!checkMac(e.mac)) valid = false
    if (!checkName(e.name)) valid = false

    if (e.key.length > 0 && e.name.length == 0) {
      global.messageError = 'You need to supply a unique name for each device'
      valid = false
    }

    // TODO: Check if the names are unique

    logDebug('DeviceWifiView.saveSettings()', e)
  })

  if (!valid) return
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
