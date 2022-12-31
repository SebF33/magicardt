<template>
  <div class="container my-8 px-16 sm:px-8 md:px-16 lg:px-18">
    <transition name="el-zoom-in-center" appear>
      <v-banner class="mt-14 mb-4 z-10" elevation="10" rounded>
        <img
          class="mr-6"
          :src="this.setDatas.icon_svg_uri"
          width="50"
          :alt="this.setDatas.name"
          draggable="false"
          ondragstart="return false"
        />
        <v-banner-text>
          <span class="text-xl font-bold">{{ this.setDatas.name }}</span>
          <br />
          <span class="text-xs font-oswald"
            >Date de sortie : {{ this.setDatas.released_at }}</span
          >
          <br />
          <span class="text-xs font-oswald"
            >Nombre de cartes : {{ this.setDatas.card_count }}</span
          >
          <br />
          <v-slider
            class="mx-6 text-xs font-oswald"
            v-model="sliderValue"
            :ticks="tickLabels"
            :max="6"
            step="1"
            show-ticks="always"
            tick-size="1"
            hide-details="true"
            thumb-size="12"
            color="#57523d"
            thumb-color="#2e1d22"
            track-color="#dbd9bd"
          ></v-slider>
        </v-banner-text>
      </v-banner>
    </transition>
    <TransitionGroup
      name="bounce"
      tag="div"
      class="
        grid
        gap-4
        sm:gap-8
        grid-cols-2
        sm:grid-cols-4
        md:grid-cols-5
        lg:grid-cols-6
        xl:grid-cols-7
        2xl:grid-cols-8
      "
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
      slider: {
        0: "pb-0/1",
        1: "pb-1/4",
        2: "pb-1/2",
        3: "pb-3/4",
        4: "pb-1/1",
        5: "pb-5/4",
        6: "pb-3/2",
      },
      sliderValue: 6,
      tickLabels: {
        0: "0%",
        1: "25%",
        2: "50%",
        3: "75%",
        4: "100%",
        5: "125%",
        6: "150%",
      },
    };
  },

  beforeMount() {
    this.cardsDatas();
  },

  methods: {
    cardsDatas() {
      axios
        .get(
          `${apiURL}/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${this.setCode}&unique=prints`
        )
        .then((response) => {
          var results = response.data.data;
          this.cards = results.map((card) => ({
            id: card.id,
            name: card.name,
            image: card?.image_uris?.normal,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setClick(id) {
      this.emitter.emit("showCardFromGalleryEvent", id);
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: scale(0.92);
}

/* Vuetify components */
.v-banner {
  background-color: var(--lighter-primary-color);
}

.v-banner-text {
  width: 100%;
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