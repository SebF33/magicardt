<template>
  <div
    class="
      container
      my-28
      px-16
      sm:my-32 sm:px-8
      md:my-32 md:px-16
      lg:my-40 lg:px-32
    "
  >
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
      <div v-for="card in cards" :key="card.id" class="relative pb-3/2">
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
    setDatas: Object,
  },

  data() {
    return {
      cards: [],
    };
  },

  beforeMount() {
    this.cardsDatas();
  },

  methods: {
    cardsDatas() {
      axios
        .get(
          `${apiURL}/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${this.setDatas.code}&unique=prints`
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