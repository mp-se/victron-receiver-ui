/*
  victron-receiver-ui
  Copyright (C) 2024-2026 Magnus

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { ref } from 'vue'
import { createPinia } from 'pinia'
import { useGlobalStore } from '@/modules/globalStore'
import { useStatusStore } from '@/modules/statusStore'
import { useConfigStore } from '@/modules/configStore'
import { logDebug, logInfo } from '@mp-se/espframework-ui-components'

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
