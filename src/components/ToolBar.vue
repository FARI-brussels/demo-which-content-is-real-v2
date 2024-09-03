<template>
  <div class="toolbar">
    <div class="left">
      <slot name="left" />
    </div>

    <div class="center">
      <slot name="center" />
    </div>

    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$padding: 1rem;
$transparency: 0.85;

@function hex-to-rgba($hex, $alpha) {
  $red: red($hex);
  $green: green($hex);
  $blue: blue($hex);
  @return rgba($red, $green, $blue, $alpha);
}

.toolbar {
  display: flex;
  width: calc(100% - calc(#{$padding} * 2));
  background: transparent;
  // background-color: hex-to-rgba(#133777, $transparency);
  justify-content: space-between;
  align-items: center;
  padding: $padding;
  height: calc(120px - #{$padding} * 2);
}
.left,
.center,
.right {
  position: relative;
}
</style>
