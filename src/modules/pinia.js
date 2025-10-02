import { ref } from 'vue'
import { createPinia } from 'pinia'
import { useGlobalStore } from '@/modules/globalStore'
import { useStatusStore } from '@/modules/statusStore'
import { useConfigStore } from '@/modules/configStore'
import { logDebug, logInfo } from '@/modules/logger'

const piniaInstance = createPinia()

export default piniaInstance

const config = useConfigStore(piniaInstance)
const global = useGlobalStore(piniaInstance)
const status = useStatusStore(piniaInstance)

export { global, status, config }

const configCompare = ref(null)

const saveConfigState = () => {
  logInfo('pinia.saveConfigState()', 'Saving state')

  configCompare.value = {}
  for (const key in config) {
    if (typeof config[key] !== 'function' && key !== '$id') {
      if (key === 'victron_config') {
        configCompare.value[key] = []
        for (const i in config[key]) {
          const o = { name: config[key][i].name, mac: config[key][i].mac, key: config[key][i].key }
          configCompare.value[key].push(o)
        }
      } else {
        configCompare.value[key] = config[key]
      }
    }
  }

  logInfo('pinia.saveConfigState()', 'Saved state: ', configCompare.value)
  global.configChanged = false
}

const getConfigChanges = () => {
  logDebug('pinia.getConfigChanges()', 'Getting changes')
  const changes = {}

  if (configCompare.value === null) {
    logInfo('pinia.getConfigChanges()', 'configState not saved')
    return changes
  }

  for (var key in configCompare.value) {
    if (key === 'victron_config') {
      logDebug(configCompare.value.victron_config)
      logDebug(config.victron_config)

      for (var i in configCompare.value[key]) {
        if (configCompare.value[key][i].name != config[key][i].name) {
          changes.victron_config = config.victron_config
        }
        if (configCompare.value[key][i].mac != config[key][i].mac) {
          changes.victron_config = config.victron_config
        }
        if (configCompare.value[key][i].key != config[key][i].key) {
          changes.victron_config = config.victron_config
        }
      }
    } else {
      if (configCompare.value[key] != config[key]) {
        changes[key] = config[key]
      }
    }
  }

  return changes
}

config.$subscribe(() => {
  if (!global.initialized) return

  var changes = getConfigChanges()
  logInfo('pinia.subscribe()', 'State change on configStore', changes)

  if (JSON.stringify(changes).length > 2) {
    global.configChanged = true
    logInfo('pinia.subscribe()', 'Changed properties:', changes)
  } else {
    global.configChanged = false
  }
})

export { saveConfigState, getConfigChanges }
