<template>
  <div class="container px-5 py-5 mx-5 my-5 lg:pt-12 lg:px-32">
    <TransitionGroup
      name="gallery"
      tag="div"
      class="lg:gap-2 lg:grid lg:grid-cols-8"
    >
      <div v-for="card in cards" :key="card.id" class="w-full p-1 md:p-4">
        <img
          @click="setClick(card)"
          :src="card.image"
          :alt="card.name"
          class="card block object-cover object-center rounded-lg"
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
            image: card?.image_uris?.small,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setClick(card) {
      this.emitter.emit("showCardEvent", card);
    },
  },
};
</script>

<style scoped>
.gallery-enter-active,
.gallery-leave-active {
  transition: all 0.5s ease;
}

.gallery-enter-from,
.gallery-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.card {
  filter: drop-shadow(5px 5px 5px #222);
}
</style>