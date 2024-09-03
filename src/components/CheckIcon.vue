<template>
  <div class="wrapper" :class="`bg-color-green`">
    <svg width="24" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_188_349)">
        <path
          d="M2.75 11.5L9.75 18.5L22.75 5.5"
          stroke="#454545"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="stroke-color-white"
        />
      </g>
      <defs>
        <clipPath id="clip0_188_349">
          <rect width="24" height="24" fill="white" transform="translate(0.75)" />
        </clipPath>
      </defs>
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
