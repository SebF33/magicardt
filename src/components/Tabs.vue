<template>
  <v-sheet elevation="8">
    <v-tabs
      grow
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      show-arrows
    >
      <v-tab
        v-for="item in setsList.slice(0, 30)"
        @click="setClick(item.code)"
        :key="item.setTerm"
      >
        <img
          :src="item.icon_svg_uri"
          width="32"
          :alt="item.name"
          :title="item.name"
          draggable="false"
          ondragstart="return false"
        />
      </v-tab>
    </v-tabs>
  </v-sheet>
</template>

<script>
export default {
  name: "Tabs",

  props: {
    setsList: Object,
  },

  methods: {
    setClick(code) {
      this.emitter.emit("showGalleryEvent", code);
    },
  },
};
</script>