<template>
  <div class="inline-block flex justify-center">
    <transition name="bounce" appear>
      <a class="w-48" href="/magicardt/">
        <img :src="logo" />
      </a>
    </transition>
  </div>
</template>

<script>
import logo from "../assets/logo.png";

export default {
  name: "Logo",

  data: () => ({
    logo,
  }),
};
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.8s;
}
.bounce-leave-active {
  animation: bounce-in 0.8s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
