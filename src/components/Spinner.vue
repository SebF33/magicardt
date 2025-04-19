<template>
  <div class="spinner-container">
    <div class="half-circle-spinner mx-auto">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Spinner",
};
</script>

<style scoped>
.spinner-container {
  margin: 0 auto;
  margin-top: 164px;
  width: 223px;
  height: 310px;
  user-select: none;
}

.half-circle-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 100%;
}

.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(60px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  border-top-color: var(--secondary-color);
  animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: var(--secondary-color);
  animation: half-circle-spinner-animation 1s infinite alternate;
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
