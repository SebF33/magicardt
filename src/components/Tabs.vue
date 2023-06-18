<template>
  <transition name="el-zoom-in-center" appear>
    <v-sheet elevation="14">
      <v-tabs
        bg-color="primary-color"
        slider-color="primary-color"
        center-active
        show-arrows="always"
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
      >
        <v-tab
          v-for="item in setsList"
          @click="setClick(item.code)"
          :key="item"
        >
          <img
            :src="item.icon_svg_uri"
            class="icon-svg"
            width="26"
            :title="item.name"
            draggable="false"
            ondragstart="return false"
          />
        </v-tab>
      </v-tabs>
    </v-sheet>
  </transition>
</template>

<script>
import axios from "axios";
import { onBeforeMount, ref } from "vue";

const apiURL = "https://api.scryfall.com";

export default {
  name: "Tabs",

  methods: {
    setClick(code) {
      this.emitter.emit("showGalleryEvent", code);
    },
  },

  setup() {
    const setsList = ref([]);

    onBeforeMount(async () => {
      await axios.get(`${apiURL}/sets`).then((res) => {
        setsList.value = res.data.data
          .filter(function (item) {
            return (
              item.set_type === "commander" || item.set_type === "expansion"
            );
          })
          .map((item) => {
            return {
              id: item.id,
              ...item,
            };
          });
      });
    });

    return {
      setsList,
    };
  },
};
</script>

<style scoped>
/* Conversion de "secondary-color" pour les sources SVG */
.icon-svg {
  filter: invert(10%) sepia(29%) saturate(656%) hue-rotate(291deg)
    brightness(92%) contrast(92%);
}
</style>