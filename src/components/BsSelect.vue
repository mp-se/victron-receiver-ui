<template>
  <BsInputBase :width="width" :label="label" :help="help" :badge="badge">
    <select v-model="model" class="form-select" :disabled="disabled">
      <template v-for="o in options" :key="o.value">
        <option v-if="o.value === model" selected :value="o.value">
          <IconWifi />{{ o.label }}
        </option>
        <option v-else :value="o.value">{{ o.label }}</option>
      </template>
    </select>
  </BsInputBase>
</template>

<script setup>
import IconWifi from '@/components/IconWifi.vue'
/**
 * 2024-05-28 Bootstrap VueJS wrapper, Magnus Persson
 */

/**
 * Purpose: Provide a select option
 */
defineOptions({
  inheritAttrs: false
})
/**
 * Ref to bind value to (required).
 */
const model = defineModel({
  required: true
})
/**
 * This text is shown above the form component (optional).
 */
const label = defineModel('label', {
  type: String,
  default: undefined
})
/**
 * Help text is shown below the field to provide user help with input (optional).
 */
const help = defineModel('help', {
  type: String,
  default: undefined
})
/**
 * Specify the width to force a specific size (optional).
 */
const width = defineModel('width', {
  type: [String, Number],
  default: undefined
})
/**
 * Options for the dropdown in the format [ { label: "label", value: "value" } ]
 * Label is displayed in the list and value is stored in the bound ref (required).
 */
const options = defineModel('options', {
  type: Array,
  required: true,
  validator: (value) => Array.isArray(value) && value.every(
    item => item && typeof item.label === 'string' && 'value' in item
  )
})
/**
 * Ref that steers if this component is enabled or not (optional).
 */
const disabled = defineModel('disabled', {
  type: Boolean,
  default: false
})
/**
 * Specify if an badge should be shown to guide the user (optional).
 */
const badge = defineModel('badge', {
  type: Boolean,
  default: false
})
</script>
