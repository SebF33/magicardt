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
          :key="item.id"
          @click="setClick(item.code)"
        >
          <img
            :src="item.icon_svg_uri"
            :alt="item.name"
            :title="item.name"
            class="icon-svg"
            width="26"
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
      try {
        const res = await axios.get(`${apiURL}/sets`);
        setsList.value = res.data.data
          .filter(
            (item) =>
              item.set_type === "commander" || item.set_type === "expansion"
          )
          .map((item) => ({
            id: item.id,
            ...item,
          }));
      } catch (error) {
        console.error("Erreur lors du chargement des sets :", error);
      }
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
