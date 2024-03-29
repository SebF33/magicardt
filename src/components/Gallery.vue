<template>
  <div class="container my-8 px-16 sm:px-8 md:px-16 lg:px-18">
    <transition name="el-zoom-in-center" appear>
      <v-banner class="mt-16 mb-10 z-10" elevation="10" rounded>
        <v-banner-text>
          <div class="flex">
            <img
              class="banner-symbol mr-6"
              :src="this.setDatas.icon_svg_uri"
              width="60"
              :alt="this.setDatas.name"
              draggable="false"
              ondragstart="return false"
            />
            <p class="text-xl font-bold">{{ this.setDatas.name }}</p>
          </div>
          <p class="mt-1 text-xs font-oswald">
            Date de sortie : {{ this.setDatas.released_at }}
          </p>
          <p class="text-xs font-oswald">
            Nombre de cartes : {{ this.setDatas.card_count }}
          </p>

          <v-slider
            class="text-xs font-oswald"
            color="darkerPrimary"
            hide-details="true"
            :max="6"
            show-ticks="always"
            step="1"
            thumb-color="secondary"
            thumb-size="12"
            tick-size="1"
            :ticks="tickLabels"
            track-color="lightestPrimary"
            v-model="sliderValue"
          >
          </v-slider>

          <v-pagination
            v-if="currentPage >= 1 || hasMoreCards"
            v-model="currentPage"
            :color="primary"
            :length="totalPages"
            :total-visible="5"
          >
          </v-pagination>
        </v-banner-text>
      </v-banner>
    </transition>

    <TransitionGroup
      name="bounce"
      tag="div"
      class="grid gap-4 sm:gap-8 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        :class="slider[sliderValue]"
        class="relative transition-all"
      >
        <img
          @click="setClick(card.id)"
          :src="card.image"
          :alt="card.name"
          class="card absolute object-cover rounded-lg cursor-pointer"
          draggable="false"
          ondragstart="return false"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import axios from "axios";

const apiURL = "https://api.scryfall.com";

export default {
  name: "Gallery",

  props: {
    setCode: String,
    setDatas: Object,
  },

  data() {
    return {
      cards: [],
      currentPage: 1,
      hasMoreCards: false,
      slider: {
        0: "pb-0/1",
        1: "pb-1/4",
        2: "pb-1/2",
        3: "pb-3/4",
        4: "pb-1/1",
        5: "pb-5/4",
        6: "pb-3/2",
      },
      sliderValue: 2,
      tickLabels: {
        0: "0%",
        1: "25%",
        2: "50%",
        3: "75%",
        4: "100%",
        5: "125%",
        6: "150%",
      },
      totalPages: 1,
    };
  },

  methods: {
    fetchCardsData() {
      const url = `${apiURL}/cards/search`;

      axios
        .get(url, {
          params: {
            unique: "cards",
            order: "name",
            include_extras: true,
            include_variations: false,
            q: `e:${this.setCode}`,
            page: this.currentPage,
          },
        })
        .then((response) => {
          let results = response.data.data;
          let totalCards = response.data.total_cards;

          this.cards = results.map((card) => ({
            id: card.id,
            name: card.name,
            image:
              card?.image_uris?.normal ?? card.card_faces[0].image_uris.normal,
          }));
          this.hasMoreCards = response.data.has_more;
          if (this.hasMoreCards)
            this.totalPages = Math.ceil(totalCards / results.length);
          else this.totalPages = this.currentPage;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setClick(id) {
      this.emitter.emit("showCardFromGalleryEvent", id);
    },
  },

  mounted() {
    this.fetchCardsData();
  },

  watch: {
    currentPage: {
      handler() {
        this.fetchCardsData();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  transition: all 0.2s ease-in-out;
  will-change: transform;
}

.card:hover {
  transform: scale(0.92);
}

/* Vuetify components */
.v-banner {
  background-color: var(--lighter-primary-color);
}

.v-banner-text {
  padding: 0;
  width: 100%;
}

.v-slider {
  max-width: 360px;
}

.banner-symbol {
  max-height: 56px;
  will-change: transform;
}

/* Bounce animations */
.bounce-enter-active {
  animation: bounce-in 0.6s;
}

.bounce-leave-active {
  animation: bounce-in 0.6s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.08);
  }

  100% {
    transform: scale(1);
  }
}
</style>