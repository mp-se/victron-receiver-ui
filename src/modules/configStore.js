import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { logDebug, logError, logInfo, sharedHttpClient } from '@mp-se/espframework-ui-components'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      // Device
      id: '',
      mdns: '',
      temp_format: '',
      dark_mode: false,
      admin_pass: '',
      // Hardware
      ble_scan_time: 5,
      timezone: 'CET-1CEST,M3.5.0,M10.5.0/3',
      // Wifi
      wifi_portal_timeout: 0,
      wifi_connect_timeout: 0,
      wifi_ssid: '',
      wifi_ssid2: '',
      wifi_pass: '',
      wifi_pass2: '',
      wifi_scan_ap: false,
      // Push - Generic
      push_timeout: 0,
      push_resend_time: 300,
      // Push - POST
      http_post_target: '',
      http_post_header1: '',
      http_post_header2: '',
      // Push - MQTT
      mqtt_target: '',
      mqtt_port: '',
      mqtt_user: '',
      mqtt_pass: '',
      victron_config: []
    }
  },
  actions: {
    toJson() {
      logInfo('configStore.toJSON()')
      const dest = {}

      for (const key in this.$state) {
        if (!key.startsWith('$')) {
          dest[key] = this[key]
        }
      }

      logInfo('configStore.toJSON()', dest)
      return JSON.stringify(dest, null, 2)
    },
    async load() {
      global.disabled = true
      logInfo('configStore.load()', 'Fetching /api/config')

      try {
        const json = await sharedHttpClient.getJson('api/config')
        logDebug('configStore.load()', json)

        global.disabled = false
        this.id = json.id
        // Device
        this.mdns = json.mdns
        this.temp_format = json.temp_format
        this.dark_mode = json.dark_mode
        this.admin_pass = json.admin_pass
        // Security
        this.victron_config = json.victron_config
        // Hardware
        this.ble_scan_time = json.ble_scan_time
        this.timezone = json.timezone
        // Wifi
        this.wifi_portal_timeout = json.wifi_portal_timeout
        this.wifi_connect_timeout = json.wifi_connect_timeout
        this.wifi_ssid = json.wifi_ssid
        this.wifi_ssid2 = json.wifi_ssid2
        this.wifi_pass = json.wifi_pass
        this.wifi_pass2 = json.wifi_pass2
        this.wifi_scan_ap = json.wifi_scan_ap
        // Push - Generic
        this.push_timeout = json.push_timeout
        this.push_resend_time = json.push_resend_time
        // Push - POST
        this.http_post_target = json.http_post_target
        this.http_post_header1 = json.http_post_header1
        this.http_post_header2 = json.http_post_header2
        // Push - MQTT
        this.mqtt_target = json.mqtt_target
        this.mqtt_port = json.mqtt_port
        this.mqtt_user = json.mqtt_user
        this.mqtt_pass = json.mqtt_pass
        return true
      } catch (err) {
        global.disabled = false
        logError('configStore.load()', err)
        return false
      }
    },
    async sendConfig() {
      global.disabled = true
      logInfo('configStore.sendConfig()', 'Sending /api/config')

      const data = getConfigChanges()
      logDebug('configStore.sendConfig()', data)

      if (JSON.stringify(data).length == 2) {
        logInfo('configStore.sendConfig()', 'No config data to store, skipping step')
        global.disabled = false
        return true
      }

      try {
        await sharedHttpClient.postJson('api/config', data)
        global.disabled = false
        logInfo('configStore.sendConfig()', 'Sending /api/config completed')
        return true
      } catch (err) {
        logError('configStore.sendConfig()', err)
        global.disabled = false
        return false
      }
    },
    async sendWifiScan() {
      global.disabled = true
      logInfo('configStore.sendWifiScan()', 'Sending /api/wifi')

      try {
        await sharedHttpClient.getJson('api/wifi')
        logInfo('configStore.sendWifiScan()', 'Sending /api/wifi completed')
        global.disabled = false
        return true
      } catch (err) {
        logError('configStore.sendWifiScan()', err)
        global.disabled = false
        return false
      }
    },
    async getWifiScanStatus() {
      logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status')

      try {
        const json = await sharedHttpClient.getJson('api/wifi/status')
        logDebug('configStore.getWifiScanStatus()', json)
        logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status completed')
        return { success: true, data: json }
      } catch (err) {
        logError('configStore.getWifiScanStatus()', err)
        return { success: false, data: null }
      }
    },
    async saveAll() {
      global.clearMessages()
      global.disabled = true
      const success = await this.sendConfig()
      if (!success) {
        global.disabled = false
        global.messageError = 'Failed to store configuration to device'
      } else {
        global.messageSuccess = 'Configuration has been saved to device'
        saveConfigState()
      }
    },
    async sendFilesystemRequest(data) {
      global.disabled = true
      logInfo('configStore.sendFilesystemRequest()', 'Sending /api/filesystem')

      try {
        const text = await sharedHttpClient.postText('api/filesystem', data)
        logDebug('configStore.sendFilesystemRequest()', text)
        global.disabled = false
        return { success: true, text: text }
      } catch (err) {
        logError('configStore.sendFilesystemRequest()', err)
        global.disabled = false
        return { success: false, text: '' }
      }
    },
    async runWifiScan() {
      global.disabled = true
      const success = await this.sendWifiScan()
      if (success) {
        return new Promise((resolve) => {
          const check = setInterval(async () => {
            const result = await this.getWifiScanStatus()
            if (result.success) {
              if (result.data.status) {
                // test is still running, just wait for next check
              } else {
                global.disabled = false
                clearInterval(check)
                resolve({ success: result.data.success, data: result.data })
              }
            } else {
              global.disabled = false
              global.messageError = 'Failed to get wifi scan status'
              clearInterval(check)
              resolve({ success: false })
            }
          }, 2000)
        })
      } else {
        global.disabled = false
        global.messageError = 'Failed to start wifi scan'
        return { success: false }
      }
    },
    async restart() {
      global.clearMessages()
      global.disabled = true

      const result = await sharedHttpClient.restart(this.mdns)

      if (result.success) {
        logDebug('configStore.restart()', result.json)
        if (result.json.status == true) {
          global.messageSuccess =
            result.json.message + ' Redirecting to http://' + this.mdns + '.local in 8 seconds.'
          logInfo('configStore.restart()', 'Scheduling refresh of UI')
          setTimeout(() => {
            location.href = 'http://' + this.mdns + '.local'
          }, 8000)
        } else {
          global.messageError = result.json.message
          global.disabled = false
        }
      } else {
        logError('configStore.restart()', result.error)
        global.messageError = 'Failed to do restart'
        global.disabled = false
      }
    }
  }
})
