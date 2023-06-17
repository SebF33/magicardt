<template>
  <div class="tiny-spinner-container">
    <div class="half-circle-spinner mx-auto">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TinySpinner",
};
</script>

<style scoped>
.tiny-spinner-container .half-circle-spinner {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 100%;
}

.tiny-spinner-container .half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(60px / 10) solid transparent;
}

.tiny-spinner-container .half-circle-spinner .circle.circle-1 {
  border-top-color: var(--secondary-color);
  animation: half-circle-spinner-animation 0.8s infinite;
}

.tiny-spinner-container .half-circle-spinner .circle.circle-2 {
  border-bottom-color: var(--secondary-color);
  animation: half-circle-spinner-animation 0.8s infinite alternate;
}

@keyframes half-circle-spinner-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
