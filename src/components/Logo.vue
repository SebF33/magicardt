<template>
  <v-row class="text-center mt-2">
    <v-col cols="12">
      <a class="logo mb-2" href="/magicardt/"
        ><img :src="logo" height="150"
      /></a>
    </v-col>
  </v-row>
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
