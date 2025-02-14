<script setup>
import { computed, useSlots, ref } from 'vue'
import BaseButton from './BaseButton.vue'
import { mdiCloseCircle,mdiMinusCircle } from '@mdi/js'

const props = defineProps({
  label: {
    type: String,
    default: null
  },
  labelFor: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  },
  isExpandable: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots()

const wrapperClass = computed(() => {
  const base = []
  const slotsLength = slots.default().length

  if (slotsLength > 1) {
    base.push('grid grid-cols-1 gap-3')
  }

  if (slotsLength === 2) {
    base.push(`md:grid-cols-2`)
  }

  return base
})

const isOpen = ref(!props.isExpandable)
</script>

<template>
  <div :class="isOpen ? 'mb-6 last:mb-0' : 'last:mb-0'">
    <div class="flex flex-row justify-between items-center" :class="{ 'mb-3': props.isExpandable && isOpen }">
      <label
        v-if="props.label"
        :for="props.labelFor"
        :class="props.isExpandable ? 'font-bold' : 'block font-bold mb-2'"
        >
        {{ props.label }}
        </label>
      <BaseButton v-if="props.isExpandable" :icon="isOpen ? mdiCloseCircle : mdiMinusCircle" :color="isOpen ? 'danger' : 'success'" @click="isOpen = !isOpen" />
    </div>
    <template v-if="isOpen">
      <div :class="wrapperClass">
        <slot />
      </div>
      <div v-if="props.help" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        {{ props.help }}
      </div>
    </template>
  </div>
</template>
