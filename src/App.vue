<template>
  <dialog id="spinner" class="loading">
    <div class="container text-center">
      <div class="row align-items-center" style="height: 170px">
        <div class="col">
          <div class="spinner-border" role="status" style="width: 5rem; height: 5rem">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <div v-if="!global.initialized" class="container text-center">
    <BsMessage
      message="Initalizing Victron BLE Receiver Web interface"
      :dismissable="false"
      alert="info"
    ></BsMessage>
  </div>

  <BsMenuBar
    v-if="global.initialized"
    :disabled="global.disabled"
    brand="Victron Receiver"
    :menu-items="items"
    :dark-mode="config.dark_mode"
    :mdns="config.mdns"
    :config-changed="global.configChanged"
    @update:dark-mode="handleDarkModeUpdate"
  />
  <div class="container">
    <div>
      <p></p>
    </div>

    <BsMessage
      v-if="global.isError"
      :close="close"
      :dismissable="true"
      :message="global.messageError"
      alert="danger"
    />
    <BsMessage
      v-if="global.isWarning"
      :close="close"
      :dismissable="true"
      :message="global.messageWarning"
      alert="warning"
    />
    <BsMessage
      v-if="global.isSuccess"
      :close="close"
      :dismissable="true"
      :message="global.messageSuccess"
      alert="success"
    />
    <BsMessage
      v-if="global.isInfo"
      :close="close"
      :dismissable="true"
      :message="global.messageInfo"
      alert="info"
    />

    <BsMessage v-if="status.wifi_setup" :dismissable="false" alert="info">
      Running in WIFI setup mode. Go to the
      <router-link class="alert-link" to="/device/wifi">wifi settings</router-link> meny and select
      wifi. Restart device after settings are selected.
    </BsMessage>
  </div>

  <router-view v-if="global.initialized" />
  <BsFooter v-if="global.initialized" text="(c) 2024-2025 Magnus Persson" />
  <BsModalLogin v-if="showLogin" :callback="confirmLoginCallback" id="login" />
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { global, status, config, saveConfigState } from '@/modules/pinia'
import { storeToRefs } from 'pinia'
import { logDebug, logInfo, logError, sharedHttpClient } from '@mp-se/espframework-ui-components'

const { disabled } = storeToRefs(global)

const showLogin = ref(false)

const close = (alert) => {
  if (alert == 'danger') global.messageError = ''
  else if (alert == 'warning') global.messageWarning = ''
  else if (alert == 'success') global.messageSuccess = ''
  else if (alert == 'info') global.messageInfo = ''
}

function showLoginModal() {
  logDebug('App.showLoginModal')
  hideSpinner()
  showLogin.value = true
}

async function confirmLoginCallback(password) {
  logDebug('App.login', 'Login using password')
  showLogin.value = false

  try {
    showSpinner()
    const base = btoa('admin:' + password)
    const success = await sharedHttpClient.auth(base)
    logDebug('App.login', success)
    if (success) {
      global.password = password
      loadConfig()
    } else {
      showLoginModal()
    }
  } catch {
    showLoginModal()
  }
}

function loadConfig() {
  config.load((success) => {
    if (success) {
      saveConfigState()
      global.initialized = true
      hideSpinner()
    } else {
      global.messageError =
        'Failed to load configuration data from device, please try to reload page!'
    }
  })
}

watch(disabled, () => {
  if (global.disabled) document.body.style.cursor = 'wait'
  else document.body.style.cursor = 'default'
})

onMounted(async () => {
  if (!global.initialized) {
    showSpinner()
    logDebug('App.onMounted', 'Starting up ssl =', sharedHttpClient.baseURL.startsWith('https'))

    const success = await status.load()
    if (success) {
      global.platform = status.platform
      global.id = status.id
      if (!status.wifi_setup && sharedHttpClient.baseURL.startsWith('https')) showLoginModal()
      else loadConfig()
    } else {
      global.messageError = 'Failed to load status from device, please try to reload page!'
    }
  }
})

// Watch for changes to config.dark_mode and call handleDarkModeUpdate
watch(
  () => config.dark_mode,
  (newValue) => {
    handleDarkModeUpdate(newValue)
  }
)

// Handle dark mode changes
const handleDarkModeUpdate = (newValue) => {
  logInfo('App.handleDarkModeUpdate()', 'Updating dark mode settings', newValue)

  // update the store value
  config.dark_mode = newValue
  // fallback: ensure the attribute is set on the document root so Bootstrap theme rules apply
  try {
    const root = document.documentElement
    if (newValue) root.setAttribute('data-bs-theme', 'dark')
    else root.setAttribute('data-bs-theme', 'light')
  } catch (e) {
    logError('App.handleDarkModeUpdate()', 'Failed to set data-bs-theme on documentElement', e)
  }
}

function showSpinner() {
  document.querySelector('#spinner').showModal()
}

function hideSpinner() {
  document.querySelector('#spinner').close()
}
</script>

<style>
.loading {
  position: fixed;
  width: 200px;
  height: 200px;
  padding: 10px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
}

dialog::backdrop {
  background-color: black;
  opacity: 60%;
}
</style>
