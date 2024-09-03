<template>
  <div class="wrapper" :class="`bg-color-red`">
    <svg width="24" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.75 3L3.75 21"
        stroke-width="4"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="stroke-color-white"
      />
      <path
        d="M21.75 21L3.75 3"
        stroke-width="4"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="stroke-color-white"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
}
svg {
  cursor: pointer;
  path {
    transition: fill 0.2s;
  }
}
</style>
