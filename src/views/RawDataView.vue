<!--
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
-->
<template>
  <div class="container">
    <p class="fs-6">
      This shows all the parsed data fields and these are also pushed to Home Assistant. If you see
      anything that is faulty please open an issue on github.
    </p>

    <div v-if="status" class="container overflow-hidden text-center">
      <div class="row gy-4">
        <template v-for="g in status.victron_device" :key="g.mac">
          <div class="col-md-6">
            <BsCard :header="g.data.name" color="info" :title="g.name">
              <template #header> </template>
              <slot>
                <template v-if="g.data.name.startsWith('Exide')">
                  <template v-for="[key, val] in Object.entries(g.data)" :key="key">
                    {{ key }}: {{ val }}<br />
                  </template>
                </template>
                <template v-else>
                  <p class="text-center">
                    model string: {{ status.getModelString(Number(g.data.model)) }}<br />
                    <template v-for="[key, val] in Object.entries(g.data)" :key="key">
                      {{ key }}: {{ val }}<br />
                    </template>
                  </p>
                </template>
              </slot>
            </BsCard>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { status } from '@/modules/pinia'
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

const polling = ref(null)

async function refresh() {
  await status.load()
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
