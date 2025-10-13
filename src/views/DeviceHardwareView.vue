<template>
  <div class="container">
    <p></p>
    <p class="h3">Device - Hardware</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-4">
          <BsInputNumber
            v-model="config.ble_scan_time"
            unit="s"
            label="Scanning Time"
            width="3"
            :disabled="global.disabled"
          ></BsInputNumber>
        </div>
        <div class="col-md-4">
          <BsSelect
            v-model="config.timezone"
            :options="timezoneOptions"
            label="Timezone"
            width=""
            :disabled="global.disabled"
          ></BsSelect>
        </div>
      </div>
      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-12">
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
            &nbsp;Restart device
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

// List of timezones, https://github.com/nayarsystems/posix_tz_db/blob/master/zones.csv

const timezoneOptions = ref([
  { label: 'America/Los Angeles', value: 'PST8PDT,M3.2.0,M11.1.0' },
  { label: 'America/Phoenix', value: 'MST7' },
  { label: 'America/Denver', value: 'MST7MDT,M3.2.0,M11.1.0' },
  { label: 'America/Chicago', value: 'CST6CDT,M3.2.0,M11.1.0' },
  { label: 'America/New York', value: 'EST5EDT,M3.2.0,M11.1.0' },
  { label: 'Europe/London', value: 'GMT0BST,M3.5.0/1,M10.5.0' },
  { label: 'Europe/Stockholm', value: 'CET-1CEST,M3.5.0,M10.5.0/3' },
  { label: 'Europe/Helsinki', value: 'EET-2EEST,M3.5.0/3,M10.5.0/4' },
  { label: 'Asia/Singapore', value: '<+08>-8' },
  { label: 'Asia/Tokyo', value: 'JST-9' },
  { label: 'Australia/Perth', value: 'AWST-8' },
  { label: 'Australia/Sydney', value: 'AEST-10AEDT,M10.1.0,M4.1.0/3' },
  { label: 'Pacific/Auckland', value: 'NZST-12NZDT,M9.5.0,M4.1.0/3' },
  { label: 'Pacific/Honolulu', value: 'HST10' }
  //{ label: '', value: "" },
])

const save = () => {
  if (!validateCurrentForm()) return

  global.clearMessages()
  config.saveAll()
}
</script>
