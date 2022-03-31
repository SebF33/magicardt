<template>
  <div class="flex justify-center">
    <a class="w-48" href="/magicardt/"><img :src="logo"/></a>
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
