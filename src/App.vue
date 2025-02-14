<script setup>
import { RouterView } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkMode.js'

const darkModeStore = useDarkModeStore()
document.documentElement.classList.forEach((token) => {
    if (token.indexOf('style') === 0) {
      document.documentElement.classList.replace(token, `style-basic`)
    }
  })
darkModeStore.set()
</script>

<template>
  <RouterView />
</template>
