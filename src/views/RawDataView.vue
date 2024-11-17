<template>
  <div class="container">
    <p></p>

    <div v-if="status" class="container overflow-hidden text-center">
      <div class="row gy-4">
        <template v-for="g in status.victron_device" :key="g.mac">
          <div class="col-md-6">
            <BsCard :header="g.data.name" color="info" :title="g.name">
              <template #header> </template>
              <slot>
                <p class="text-center">
                  model string: {{ status.getModelString(Number(g.data.model)) }}<br/>
                  <template v-for="[key, val] in Object.entries(g.data)" :key="key">
                    {{ key }}: {{ val }}<br />
                  </template>
                </p>
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
