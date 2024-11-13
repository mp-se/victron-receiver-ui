<template>
  <div class="container">
    <p></p>

    <div v-if="status" class="container overflow-hidden text-center">
      <div class="row gy-4">
        <template v-for="g in status.victron_device" :key="g.mac">
          <div class="col-md-4">
            <BsCard
              :header="g.data.name"
              color="info"
              :title="
                g.name + ' (' + formatTime(g.update_time) + ' / ' + formatTime(g.push_time) + ')'
              "
            >
              <template #header> </template>

              <slot>
                <p class="text-center">
                  <!-- These are the various templates for showing device specific data stored in the data payload -->

                  <template v-if="g.data.name == 'Smart Battery Monitor'">
                    Temperature: {{ convertTemperature(g.data.temperature) }} °{{
                      config.temp_format
                    }}<br />
                    Battery: {{ g.data.battery_voltage }} V
                  </template>

                  <template v-if="g.data.name == 'Smart DC-DC Charger'">
                    Input: {{ g.data.input_voltage }} V<br />
                    Output: {{ g.data.output_voltage }} V<br />
                    State: {{ g.data.state_message }}<br />
                    Message: {{ g.data.off_reason_message }}<br />
                  </template>

                  <template v-if="g.data.name == 'Smart AC Charger'">
                    Battery: {{ g.data.battery_voltage1 }} V<br />
                    Current: {{ g.data.ac_current }} A<br />
                    State: {{ g.data.state_message }}
                    <template v-if="g.data.error > 0"
                      ><br />Error: {{ g.data.error_message }}<br
                    /></template>
                  </template>

                  <template v-if="g.data.name == 'Smart Shunt'">
                    Battery: {{ g.data.battery_voltage }} V<br />
                    Current: {{ g.data.battery_current }} A<br />
                    Remaning: {{ g.data.remaning_mins }} min<br />
                    Consumed: {{ g.data.consumed_ah }} Ah
                  </template>

                  <template v-if="g.data.name == 'Solar Charger'">
                    State: {{ g.data.state_message }} V<br />
                    Voltage: {{ g.data.battery_voltage }} A<br />
                    Current: {{ g.data.battery_current }} min<br />
                    PV: {{ g.data.pv_power }} Ah
                    <template v-if="g.data.error > 0"
                      ><br />Error: {{ g.data.error_message }}<br
                    /></template>
                  </template>

                  <template v-if="g.data.name == 'Unknown'">
                    Unknown victron device found, copy the payload and create an issue on Github to
                    support the device.
                  </template>

                  <br />
                  <button
                    @click="copyToClipboard(g.data)"
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                  >
                    <IconClipboard icon="bi-clipboard" width="16" height="16" /> Copy data
                  </button>
                </p>
              </slot>
            </BsCard>
          </div>
        </template>

        <div class="col-md-4">
          <BsCard header="Device" title="WIFI">
            <p class="text-center">{{ status.rssi }} dBm - {{ status.wifi_ssid }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="IP Address">
            <p class="text-center">
              {{ status.ip }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Memory">
            <p class="text-center">
              Free: {{ status.free_heap }} kb, Total: {{ status.total_heap }} kb
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Software version">
            <p class="text-center">
              Firmware: {{ status.app_ver }} ({{ status.app_build }}) UI: {{ global.uiVersion }} ({{
                global.uiBuild
              }})
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Platform">
            <p class="text-center">{{ status.platform }} (id: {{ status.id }})</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Uptime">
            <p class="text-center">
              {{ status.uptime_days }} days {{ status.uptime_hours }} hours
              {{ status.uptime_minutes }} minutes {{ status.uptime_seconds }} seconds
            </p>
          </BsCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { global, status, config } from '@/modules/pinia'
import { logDebug } from '@/modules/logger'
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { tempToF } from '@/modules/utils'

const polling = ref(null)

function formatTime(t) {
  if (t < 60)
    // less than 1 min
    return new Number(t).toFixed(0) + 's'

  if (t < 60 * 60)
    // less than 1 hour
    return new Number(t / 60).toFixed(0) + 'm'

  if (t < 60 * 60 * 24)
    // less than 1 day
    return new Number(t / (60 * 60)).toFixed(0) + 'h'

  return new Number(t / (60 * 60 * 24)).toFixed(0) + 'd'
}

function convertTemperature(t) {
  logDebug('HomeView::convertTemperature()', t)
  if (config.temp_format == 'C') return t

  return tempToF(t)
}

function copyToClipboard(d) {
  logDebug('HomeView::copyToClipboard()', d)

  // if (navigator.clipboard) {
  //   navigator.clipboard.writeText(JSON.stringify(d))
  // } else {
  const input = document.createElement('textarea')
  input.value = JSON.stringify(d)
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  // }
}

function refresh() {
  status.load(() => {})
}

onBeforeMount(() => {
  refresh()
  polling.value = setInterval(refresh, 4000)
})

onBeforeUnmount(() => {
  clearInterval(polling.value)
})
</script>

<style></style>
