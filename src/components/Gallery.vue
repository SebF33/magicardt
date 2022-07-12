<template>
  <div class="container px-5 py-5 mx-5 my-5 lg:pt-12 lg:px-32">
    <TransitionGroup
      name="bounce"
      tag="div"
      class="lg:gap-2 lg:grid lg:grid-cols-8"
    >
      <div v-for="card in cards" :key="card.id" class="w-full p-1 md:p-4">
        <img
          @click="setClick(card.id)"
          :src="card.image"
          :alt="card.name"
          class="
            card
            block
            object-cover object-center
            rounded-lg
            cursor-pointer
          "
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
            image: card?.image_uris?.small,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setClick(id) {
      this.emitter.emit("showCardEvent", id);
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