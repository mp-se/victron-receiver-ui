<template>
  <div class="container">
    <p></p>
    <p class="fs-6">
      All detected devices will be displayed here. The numbers in the header shows how long ago data
      was last recevied and when it was last pushed to Home Assistant.
    </p>

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

                  <template v-if="g.data.name == 'Battery Monitor'">
                    Temperature: {{ convertTemperature(g.data.temperature) }} °{{
                      config.temp_format
                    }}<br />
                    Battery: {{ g.data.battery_voltage }} V<br />
                  </template>

                  <template v-if="g.data.name == 'DC-DC Charger'">
                    State: {{ g.data.state_message }}<br />
                    <template v-if="g.data.input_voltage != undefined"
                      >Input: {{ g.data.input_voltage }} V<br
                    /></template>
                    <template v-if="g.data.output_voltage != undefined"
                      >Output: {{ g.data.output_voltage }} V<br
                    /></template>
                    <template v-if="g.data.off_reason != 0"
                      >Message: {{ g.data.off_reason_message }}<br />
                    </template>
                  </template>

                  <template v-if="g.data.name == 'AC Charger'">
                    State: {{ g.data.state_message }}<br />
                    <template v-if="g.data.battery_voltage1 != undefined"
                      >Battery: {{ g.data.battery_voltage1 }} V<br
                    /></template>
                    <template v-if="g.data.battery_current1 != undefined"
                      >Current: {{ g.data.battery_current1 }} A<br
                    /></template>
                    <template v-if="g.data.error > 0"
                      ><br />Error: {{ g.data.error_message }}<br
                    /></template>
                  </template>

                  <template v-if="g.data.name == 'Shunt'">
                    <template v-if="g.data.soc != undefined"
                      >SOC: {{ g.data.soc }} %<br
                    /></template>
                    <template v-if="g.data.battery_voltage != undefined"
                      >Battery: {{ g.data.battery_voltage }} V<br
                    /></template>
                    <template v-if="g.data.battery_current != undefined"
                      >Current: {{ g.data.battery_current }} A<br
                    /></template>
                    <template v-if="g.data.remaning_mins != undefined"
                      >Remaning: {{ formatTime(g.data.remaning_mins * 60) }}<br
                    /></template>
                    <template v-if="g.data.consumed_ah != undefined"
                      >Consumed: {{ g.data.consumed_ah }} Ah<br
                    /></template>
                    <template v-if="g.data.alarm != 0"
                      >Alarm: {{ g.data.alarm_message }}<br
                    /></template>                    
                  </template>

                  <template v-if="g.data.name == 'Solar Charger'">
                    State: {{ g.data.state_message }}<br />
                    <template v-if="g.data.battery_voltage != undefined"
                      >Voltage: {{ g.data.battery_voltage }} V<br
                    /></template>
                    <template v-if="g.data.battery_current != undefined"
                      >Current: {{ g.data.battery_current }} A<br
                    /></template>
                    <template v-if="g.data.pv_power != undefined"
                      >PV: {{ g.data.pv_power }} W<br
                    /></template>
                    <template v-if="g.data.error > 0"
                      >Error: {{ g.data.error_message }}<br
                    /></template>
                  </template>

                  <template v-if="g.data.name == 'Battery Protect'">
                    State: {{ g.data.state_message }}<br />
                    <template v-if="g.data.input_voltage != undefined"
                      >Input Voltage: {{ g.data.input_voltage }} V<br
                    /></template>
                    <template v-if="g.data.output_voltage != undefined"
                      >Output Voltage: {{ g.data.output_voltage }} V<br
                    /></template>
                    <template v-if="g.data.error > 0"
                      >Error: {{ g.data.error_message }}<br
                    /></template>
                    <template v-if="g.data.off_reason != 0"
                      >Message: {{ g.data.off_reason_message }}<br />
                    </template>
                    <template v-if="g.data.alarm != 0"
                      >Alarm: {{ g.data.alarm_message }}<br
                    /></template>                    
                    <template v-if="g.data.warning != 0"
                      >Warning: {{ g.data.warning_message }}<br
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
  var seconds = Math.floor(t % 60)
  var minutes = Math.floor((t % (60 * 60)) / 60)
  var hours = Math.floor((t % (24 * 60 * 60)) / (60 * 60))
  var days = Math.floor((t % (7 * 24 * 60 * 60)) / (24 * 60 * 60))
  var weeks = Math.floor((t % (4 * 7 * 24 * 60 * 60)) / (7 * 24 * 60 * 60))

  var s = ''

  if (weeks > 0) s += weeks + 'w '
  if (days > 0) s += days + 'd '
  if (hours > 0) s += hours + 'h '
  if (minutes > 0) s += minutes + 'm '
  if (seconds > 0) s += seconds + 's '
  return s
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
