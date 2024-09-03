<template>
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.6476 3.28516L6.43164 12.5012L15.6476 21.7172"
      stroke="#4393DE"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  color?: string
}>()
</script>

<style scoped lang="scss">
svg {
  cursor: pointer;
  path {
    transition: fill 0.2s;
  }
}
</style>
