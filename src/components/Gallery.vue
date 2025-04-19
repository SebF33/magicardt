<!-- Gallery.vue -->
<template>
  <div class="container my-8 px-16 sm:px-8">
    <transition name="el-zoom-in-center" appear>
      <v-banner class="banner mt-12" elevation="10" rounded>
        <transition name="banner-text-transition" mode="out-in">
          <!-- Affichage pour le set -->
          <v-banner-text
            v-if="!store.artistClickInProgress && setDatas && setDatas.name"
            :key="setDatas.code"
          >
            <div class="flex items-center mb-3">
              <img
                :src="setDatas.icon_svg_uri"
                :alt="setDatas.name"
                class="set-symbol mr-6 shrink-0 will-change-transform"
                width="60"
                height="60"
                draggable="false"
                ondragstart="return false"
              />
              <div class="w-full truncate">
                <p class="text-xl font-bold truncate will-change-transform">
                  {{ setDatas.name }}
                </p>
                <p
                  class="mt-1 text-xs font-oswald truncate will-change-transform"
                >
                  Date de sortie : {{ setDatas.released_at }}
                </p>
                <p class="text-xs font-oswald truncate will-change-transform">
                  Nombre de cartes : {{ setDatas.card_count }}
                </p>
              </div>
            </div>
            <div class="flex flex-col items-start gap-4">
              <div class="w-full md:w-96 px-3">
                <v-slider
                  v-model="sliderValue"
                  :max="6"
                  :ticks="tickLabels"
                  class="mt-1 text-xs font-oswald"
                  color="darkerPrimary"
                  hide-details="true"
                  show-ticks="always"
                  step="1"
                  thumb-color="secondary"
                  thumb-size="12"
                  tick-size="1"
                  track-color="lightestPrimary"
                />
              </div>
            </div>
          </v-banner-text>
          <!-- Affichage pour l'artiste -->
          <v-banner-text
            v-else-if="store.artistClickInProgress && store.artistName"
            :key="store.artistName"
          >
            <div class="flex items-center mb-3">
              <svg
                class="artist-icon mr-6"
                width="76"
                height="76"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Icône artiste"
              >
                <path
                  d="M16 20c0-8 16-12 24-8s12 12 8 16H16z"
                  fill="currentColor"
                />
                <circle cx="32" cy="28" r="10" fill="currentColor" />
                <path
                  d="M20 60v-20c0-6 12-6 12-6s12 0 12 6v20z"
                  fill="currentColor"
                />
                <ellipse cx="48" cy="44" rx="16" ry="10" fill="currentColor" />
                <circle cx="40" cy="45" r="3" fill="#f3f2f9" />
                <circle cx="44" cy="39" r="3" fill="#246bc6" />
                <circle cx="52" cy="39" r="3" fill="#3b3b3f" />
                <circle cx="57" cy="45" r="3" fill="#ce372d" />
                <circle cx="48" cy="49" r="3" fill="#006744" />
              </svg>
              <div class="w-full truncate">
                <p class="text-xl font-bold truncate will-change-transform">
                  {{ store.artistName }}
                </p>
                <p class="mt-1 text-xs font-oswald truncate will-change-transform">
                  Nombre de cartes : {{ artistTotalCards }}
                </p>
              </div>
            </div>
          </v-banner-text>
        </transition>
        <!-- Pagination : "mode set" ou "mode artiste" -->
        <div class="w-full flex justify-center">
          <v-pagination
            v-if="
              (!store.artistClickInProgress &&
                (currentPage >= 1 || hasMoreCards)) ||
              (store.artistClickInProgress && artistCards.length > 0)
            "
            v-model="currentPage"
            :length="store.artistClickInProgress ? artistTotalPages : totalPages"
            :total-visible="5"
            color="primary"
          />
        </div>
      </v-banner>
    </transition>

    <TransitionGroup
      name="bounce"
      tag="div"
      class="grid gap-4 sm:gap-8 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 px-6 pt-6 pb-52 max-h-[420px] min-h-[420px] overflow-y-auto custom-scrollbar"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        :class="[slider[sliderValue], 'relative transition-all']"
      >
        <a @click="setClick(card.id)" class="block">
          <img
            @load="handleImageLoad(card.id)"
            :src="card.image"
            :alt="card.name"
            :aria-label="`Carte ${card.name}`"
            :class="[
              'card',
              loadedImages.includes(card.id) ? 'card-loaded' : '',
            ]"
            class="card absolute object-cover rounded-lg cursor-pointer"
            loading="lazy"
            draggable="false"
            ondragstart="return false"
            role="button"
          />
        </a>
      </div>
    </TransitionGroup>
  </div>
</template>



<script>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useMainStore } from "../utils/mainStore";

const apiURL = "https://api.scryfall.com";

export default {
  name: "Gallery",

  setup() {
    const store = useMainStore();

    // Accès aux données du store
    const setDatas = computed(() => store.setDatas);
    const setCode = computed(() => setDatas.value.code);

    // États spécifiques du "mode artiste"
    const artistCards = computed(() => store.artistCards);
    const artistTotalCards = computed(() => store.artistTotalCards);
    const artistHasMore = computed(() => store.artistHasMore);
    const artistTotalPages = computed(() => store.artistTotalPages);

    // États locaux pour la galerie
    const currentPage = ref(1);
    const hasMoreCards = ref(false);
    const loadedImages = ref([]);
    const localCards = ref([]);
    const slider = ref([
      "pb-0/1",
      "pb-1/4",
      "pb-1/2",
      "pb-3/4",
      "pb-1/1",
      "pb-5/4",
      "pb-3/2",
    ]);
    const sliderValue = ref(2);
    const tickLabels = ref({
      0: "0%",
      1: "25%",
      2: "50%",
      3: "75%",
      4: "100%",
      5: "125%",
      6: "150%",
    });
    const totalPages = ref(1);

    const fetchCardsData = async () => {
      if (!setCode.value) return;
      try {
        const { data } = await axios.get(`${apiURL}/cards/search`, {
          params: {
            unique: "cards",
            order: "name",
            include_extras: true,
            include_variations: false,
            q: `e:${setCode.value.toLowerCase()}`,
            page: currentPage.value,
          },
        });
        const totalCards = data.total_cards;
        localCards.value = data.data.map((card) => ({
          id: card.id,
          name: card.name,
          image:
            card?.image_uris?.normal ?? card.card_faces[0].image_uris.normal,
        }));
        hasMoreCards.value = data.has_more;
        totalPages.value = hasMoreCards.value
          ? Math.ceil(totalCards / data.data.length)
          : currentPage.value;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // aucun résultat trouvé
          console.warn("Aucune carte trouvée pour ce set :", setCode.value);
          localCards.value = [];
          hasMoreCards.value = false;
          totalPages.value = currentPage.value;
        } else {
          console.error("Erreur lors de la récupération des cartes :", error);
        }
      }
    };

    // Cartes de l'artiste ou celles du set
    const cards = computed(() =>
      store.artistClickInProgress ? artistCards.value : localCards.value
    );

    const setClick = (id) => {
      store.fetchCardById(id);
    };

    const handleImageLoad = (id) => {
      if (!loadedImages.value.includes(id)) {
        loadedImages.value.push(id);
      }
    };

    onMounted(() => {
      fetchCardsData();
    });

    watch(currentPage, () => {
      if (store.artistClickInProgress) {
        store.fetchCardsByArtist(store.artistName, currentPage.value);
      } else {
        fetchCardsData();
      }
    });

    // Recharger les cartes au changement de set
    watch(setCode, (newVal, oldVal) => {
      if (store.artistClickInProgress) {
        store.artistClickInProgress = false;
      }
      if (newVal !== oldVal) {
        currentPage.value = 1;
        store.artistCards = [];
        fetchCardsData();
      }
    });

    return {
      setDatas,
      cards,
      currentPage,
      hasMoreCards,
      slider,
      sliderValue,
      tickLabels,
      totalPages,
      loadedImages,
      setClick,
      handleImageLoad,
      store,
      artistCards,
      artistTotalCards,
      artistHasMore,
      artistTotalPages,
    };
  },
};
</script>



<style scoped>
/* Bannière */
.banner {
  position: relative;
  height: 160px;
  background-color: var(--lighter-primary-color);
  padding: 0.5rem 1rem;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
}

:deep(.v-banner__content) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.v-banner-text {
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  overflow: visible !important;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: fade-in-to-left 0.8s ease-out;
}

@keyframes fade-in-to-left {
  0% {
    opacity: 0;
    transform: translateX(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.banner-text-transition-enter-active,
.banner-text-transition-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.banner-text-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.banner-text-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.v-banner-text .flex.items-center {
  margin-bottom: 0 !important;
  align-items: center;
}

/* Icône de l'artiste */
.artist-icon {
  color: var(--secondary-color);
}

/* Symbole du set */
.set-symbol {
  width: 60px;
  height: auto;
  object-fit: contain;
}

.artist-icon, .set-symbol {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

/* Slider */
.v-slider {
  margin-top: 0;
  overflow: visible;
  max-width: 100%;
  padding: 0 0.5rem;
  box-sizing: border-box;
  animation: fade-in 1.4s ease-out;
}

.v-slider__container {
  overflow: visible;
}

.v-slider-track__tick-label {
  font-size: 0.65rem;
  line-height: 1;
  white-space: nowrap;
}

.v-slider-thumb {
  top: auto !important;
  bottom: -6px !important;
}

/* Pagination */
.v-pagination {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex !important;
  justify-content: center !important;
  align-items: center;
  width: auto;
  max-width: 100%;
  padding: 0;
  margin: 0;
  animation: fade-in 1.4s ease-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  85% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

:deep(.v-pagination__list) {
  gap: 0.5rem;
}

:deep(.v-pagination__item) {
  margin: 0;
}

:deep(.v-pagination__item button) {
  min-width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  font-size: 1.2rem;
}

/* Cartes */
.card {
  display: block;
  opacity: 0;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  /* will-change: transform, opacity; //trop gourmand */
}

.card-loaded {
  opacity: 1;
}

a.block .card {
  transition: all 0.15s ease-in-out;
}

a.block:hover .card {
  transform: scale(0.975);
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--lighter-primary-color);
  border-radius: 4px;
  border: 2px solid transparent;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--lighter-primary-color) transparent;
}

/* Responsive */
@media (max-width: 1280px) {
  .banner {
    height: 220px;
  }
}

@media (max-width: 640px) {
  :deep(.v-slider-track__tick-label) {
    font-size: 0.6rem;
    line-height: 1;
    white-space: nowrap;
    transform: translateY(-2px);
  }

  .v-slider {
    padding: 0 0.25rem;
  }

  .artist-icon, .set-symbol {
    width: 44px;
    height: auto;
  }

  .text-xl {
    font-size: 1rem;
  }

  .text-xs {
    font-size: 0.7rem;
  }
}
</style>