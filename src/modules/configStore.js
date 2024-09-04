import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      // Device
      id: '',
      mdns: '',
      temp_format: '',
      dark_mode: false,
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
      var dest = {}

      for (var key in this.$state) {
        if (!key.startsWith('$')) {
          dest[key] = this[key]
        }
      }

      logInfo('configStore.toJSON()', dest)
      return JSON.stringify(dest, null, 2)
    },
    load(callback) {
      global.disabled = true
      logInfo('configStore.load()', 'Fetching /api/config')
      fetch(global.baseURL + 'api/config', {
        method: 'GET',
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('configStore.load()', json)

          global.disabled = false
          this.id = json.id
          // Device
          this.mdns = json.mdns
          this.temp_format = json.temp_format
          this.dark_mode = json.dark_mode
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
          // Push - MQTT
          this.mqtt_target = json.mqtt_target
          this.mqtt_port = json.mqtt_port
          this.mqtt_user = json.mqtt_user
          this.mqtt_pass = json.mqtt_pass
          callback(true)
        })
        .catch((err) => {
          global.disabled = false
          logError('configStore.load()', err)
          callback(false)
        })
    },
    sendConfig(callback) {
      global.disabled = true
      logInfo('configStore.sendConfig()', 'Sending /api/config')

      var data = getConfigChanges()
      logDebug('configStore.sendConfig()', data)

      if (JSON.stringify(data).length == 2) {
        logInfo('configStore.sendConfig()', 'No config data to store, skipping step')
        global.disabled = false
        callback(true)
        return
      }

      fetch(global.baseURL + 'api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: global.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => {
          global.disabled = false
          if (res.status != 200) {
            logError('configStore.sendConfig()', 'Sending /api/config failed', res.status)
            callback(false)
          } else {
            logInfo('configStore.sendConfig()', 'Sending /api/config completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore.sendConfig()', err)
          callback(false)
          global.disabled = false
        })
    },
    sendWifiScan(callback) {
      global.disabled = true
      logInfo('configStore.sendWifiScan()', 'Sending /api/wifi')
      fetch(global.baseURL + 'api/wifi', {
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => {
          if (res.status != 200) {
            logError('configStore.sendWifiScan()', 'Sending /api/wifi failed')
            callback(false)
          } else {
            logInfo('configStore.sendWifiScan()', 'Sending /api/wifi completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore.sendWifiScan()', err)
          callback(false)
        })
    },
    getWifiScanStatus(callback) {
      logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status')
      fetch(global.baseURL + 'api/wifi/status', {
        method: 'GET',
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('configStore.getWifiScanStatus()', json)
          logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('configStore.getWifiScanStatus()', err)
          callback(false, null)
        })
    },
    saveAll() {
      global.clearMessages()
      global.disabled = true
      this.sendConfig((success) => {
        if (!success) {
          global.disabled = false
          global.messageError = 'Failed to store configuration to device'
        } else {
          global.messageSuccess = 'Configuration has been saved to device'
          saveConfigState()
        }
      })
    },
    sendFilesystemRequest(data, callback) {
      global.disabled = true
      logInfo('configStore.sendFilesystemRequest()', 'Sending /api/filesystem')
      fetch(global.baseURL + 'api/filesystem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: global.token },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.text())
        .then((text) => {
          logDebug('configStore.sendFilesystemRequest()', text)
          callback(true, text)
        })
        .catch((err) => {
          logError('configStore.sendFilesystemRequest()', err)
          callback(false, '')
        })
    },
    runWifiScan(callback) {
      global.disabled = true
      this.sendWifiScan((success) => {
        if (success) {
          var check = setInterval(() => {
            this.getWifiScanStatus((success, data) => {
              if (success) {
                if (data.status) {
                  // test is still running, just wait for next check
                } else {
                  global.disabled = false
                  callback(data.success, data)
                  clearInterval(check)
                }
              } else {
                global.disabled = false
                global.messageError = 'Failed to get wifi scan status'
                callback(false)
                clearInterval(check)
              }
            })
          }, 2000)
        } else {
          global.disabled = false
          global.messageError = 'Failed to start wifi scan'
          callback(false)
        }
      })
    }
  }
})
