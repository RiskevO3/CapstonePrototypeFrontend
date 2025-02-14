<template>
  <div
    class="rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm font-bold"
  >
    <div class="flex justify-between items-center gap-2">
        <slot/>
        <BaseButton :icon="mdiCloseCircle" :color="'danger'" class="w-2 h-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiCloseCircle } from '@mdi/js';
import BaseButton from './BaseButton.vue';
</script>

<style scoped></style>
