<template>
  <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
    <div class="flex flex-wrap -m-1 md:-m-2">
      <div v-for="card in cards" :key="card.id" class="flex flex-wrap w-1/3">
        <div class="w-full p-1 md:p-2">
          <img
            :src="card.image"
            :alt="card.name"
            class="block object-cover object-center w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
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
        .get(`${apiURL}/cards/search`, {
          params: {
            q: this.setDatas.code,
          },
        })
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
  },
};
</script>