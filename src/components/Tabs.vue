<template>
  <transition name="el-zoom-in-center" appear>
    <div class="tabs-container">
      <!-- Onglets -->
      <v-sheet elevation="14" class="pa-0 tabs-sheet">
        <v-tabs
          bg-color="primary-color"
          slider-color="primary-color"
          center-active
          show-arrows="always"
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          class="tabs-bar"
        >
          <v-tab
            v-for="item in filteredSets"
            :key="item.id"
            :aria-label="item.name"
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
              @error="handleImageError"
            />
          </v-tab>
        </v-tabs>
      </v-sheet>

      <!-- Filtres (type & année) -->
      <div class="tabs-filter-bar">
        <el-select
          class="filter-select"
          v-model="selectedSetType"
          filterable
          placeholder="Type"
        >
          <el-option
            v-for="item in availableSetTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          class="filter-select"
          v-model="selectedSetYear"
          filterable
          placeholder="Année"
        >
          <el-option
            v-for="item in availableYears"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>

      <!-- Loader -->
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="primary"
        class="loading-spinner"
      />

      <!-- Message d'erreur -->
      <div v-else-if="hasError" class="text-red text-center py-4">
        Une erreur est survenue lors du chargement des sets.
      </div>
    </div>
  </transition>
</template>



<script>
import axios from "axios";
import { onBeforeMount, ref, computed, watch } from "vue";

const apiURL = "https://api.scryfall.com";

export default {
  name: "Tabs",

  methods: {
    setClick(code) {
      this.emitter.emit("showGalleryEvent", code);
    },
    handleImageError(event) {
      event.target.src = "/favicon-48.png";
    },
  },

  setup() {
    const setsList = ref([]);
    const isLoading = ref(true);
    const hasError = ref(false);

    const availableSetTypes = [
      { value: "commander", label: "Commander" },
      { value: "expansion", label: "Extension" },
      { value: "core", label: "Core" },
      { value: "masters", label: "Masters" },
      { value: "draft_innovation", label: "Draft & Innovation" },
    ];

    // Valeurs stockées
    const storedType = localStorage.getItem("preferredSetType");
    const defaultType = storedType ? storedType : "expansion";
    const storedYear = localStorage.getItem("preferredSetYear");
    const defaultYear = storedYear ? storedYear : new Date().getFullYear().toString();

    // Filtre par type
    const selectedSetType = ref(defaultType);
    watch(selectedSetType, (newVal) => {
      localStorage.setItem("preferredSetType", newVal);
    });

    // Filtre par année
    const selectedSetYear = ref(defaultYear);
    watch(selectedSetYear, (newVal) => {
      localStorage.setItem("preferredSetYear", newVal);
    });

    onBeforeMount(async () => {
      try {
        const res = await axios.get(`${apiURL}/sets`);
        setsList.value = res.data.data
          .filter((item) => item.icon_svg_uri && item.released_at)
          .sort((a, b) => new Date(b.released_at) - new Date(a.released_at));
      } catch (error) {
        console.error("Erreur lors du chargement des sets :", error);
        hasError.value = true;
      } finally {
        isLoading.value = false;
      }
    });

    // Années disponibles
    const availableYears = computed(() => {
      const yearsSet = new Set(
        setsList.value.map((item) =>
          new Date(item.released_at).getFullYear().toString()
        )
      );
      const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
      return ["Toutes années", ...sortedYears];
    });

    // Filtrage combiné selon le type & l'année
    const filteredSets = computed(() => {
      return setsList.value.filter((item) => {
        let match = true;
        if (selectedSetType.value) {
          match = match && item.set_type === selectedSetType.value;
        }
        if (
          selectedSetYear.value &&
          selectedSetYear.value !== "Toutes années"
        ) {
          const itemYear = new Date(item.released_at).getFullYear().toString();
          match = match && itemYear === selectedSetYear.value;
        }
        return match;
      });
    });

    return {
      setsList,
      isLoading,
      hasError,
      availableSetTypes,
      selectedSetType,
      selectedSetYear,
      availableYears,
      filteredSets,
    };
  },
};
</script>



<style scoped>
/* Onglets */
.icon-svg {
  /* conversion de "secondary-color" pour les sources SVG */
  filter: invert(10%) sepia(29%) saturate(656%) hue-rotate(291deg)
    brightness(92%) contrast(92%);
}

.tabs-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  position: relative;
}

.tabs-sheet {
  width: 100%;
}

.tabs-bar {
  width: 100%;
  justify-content: flex-start;
}

/* Filtres */
.tabs-filter-bar {
  margin-top: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.filter-select {
  width: 160px;
  margin-right: 8px;
}

/* Loader */
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
