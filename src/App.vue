<template>
  <div class="layout bg-color-blue">
    <StartScreen v-if="startScreenVisible" @start-game="startGame" />
    <GameScreen v-else @exit-demo="exitGame" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { StartScreen, GameScreen } from './views/index'

const startScreenVisible = ref(true)
const transitionName = ref('slide-left')

const startGame = () => {
  transitionName.value = 'slide-left'
  startScreenVisible.value = false
}

const exitGame = () => {
  transitionName.value = 'slide-right'
  startScreenVisible.value = true
}
</script>

<style scoped lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  gap: 2rem;
}

.slide-left-enter-active {
  transition:
    transform 200ms ease-in,
    opacity 800ms ease-in-out;
}
.slide-left-leave-active {
  transition:
    transform 400ms ease-in-out,
    opacity 400ms ease-in-out;
}

.slide-right-enter-active {
  transition:
    transform 200ms ease-in,
    opacity 800ms ease-in-out;
}

.slide-right-leave-active {
  transition:
    transform 400ms ease-in-out,
    opacity 400ms ease-in-out;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
