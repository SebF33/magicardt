<template>
  <vue-load-image class="mt-14">
    <template v-slot:image>
      <transition name="el-zoom-in-center" appear>
        <div
          id="gradient"
          v-if="cardDatas.mana_cost"
          :style="createGradientString"
        ></div>
      </transition>
      <div id="card">
        <img
          class="card-img"
          :src="cardDatas.image_uris.png || cardback"
          width="223"
          height="310"
          alt="card"
          draggable="false"
          ondragstart="return false"
        />
        <transition name="bounce" appear>
          <h2 v-if="cardDatas.name">{{ cardDatas.name }}</h2>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <p
            class="mana-cost"
            v-if="cardDatas.mana_cost"
            v-html="cardDatas.mana_cost"
          ></p>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <p v-if="cardDatas.type_line">{{ cardDatas.type_line }}</p>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <img
            class="set-symbol"
            :src="setDatas.icon_svg_uri"
            v-if="setDatas.icon_svg_uri"
            width="32"
            :alt="setDatas.name"
            :title="setDatas.name"
            draggable="false"
            ondragstart="return false"
          />
        </transition>
        <transition name="el-fade-in-linear" appear>
          <p
            class="oracle-text"
            v-if="cardDatas.oracle_text"
            v-html="cardDatas.oracle_text"
          ></p>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <p class="flavor-text" v-if="cardDatas.flavor_text">
            {{ cardDatas.flavor_text }}
          </p>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <span class="artist font-bold" v-if="cardDatas.artist"
            >Artiste : {{ cardDatas.artist }}</span
          >
        </transition>
        <transition name="el-fade-in-linear" appear>
          <span class="power" v-if="cardDatas.power"
            >{{ cardDatas.power }}/{{ cardDatas.toughness }}</span
          >
        </transition>
        <transition name="el-fade-in-linear" appear>
          <span class="power" v-if="cardDatas.loyalty"
            >Loyauté : {{ cardDatas.loyalty }}</span
          >
        </transition>
        <transition name="el-fade-in-linear" appear>
          <el-button
            class="add-btn"
            color="#837c5e"
            v-if="cardDatas.id"
            @click="addClick"
            >Ajouter</el-button
          >
        </transition>
      </div>
    </template>
    <template v-slot:preloader>
      <div class="card">
        <Spinner :animation-duration="2000" :size="60" />
      </div>
    </template>
    <template v-slot:error>
      <div class="card">Le chargement de l'image a échoué 😕</div>
    </template>
  </vue-load-image>
</template>

<script>
import Spinner from "./Spinner.vue";
import VueLoadImage from "vue-load-image";

export default {
  name: "Card",

  components: {
    Spinner,
    "vue-load-image": VueLoadImage,
  },

  props: {
    cardDatas: Object,
    setDatas: Object,
  },

  data() {
    return {
      cardback: "",
    };
  },

  created: function () {
    this.getImageUrl();
  },

  computed: {
    createGradientString() {
      let data = this.cardDatas.colors;
      if (data !== "") {
        let cardColors = data
          .map((w) => (w === "W" ? "#f3f2f9" : w))
          .map((u) => (u === "U" ? "#246bc6" : u))
          .map((b) => (b === "B" ? "#3b3b3f" : b))
          .map((r) => (r === "R" ? "#ce372d" : r))
          .map((g) => (g === "G" ? "#006744" : g));
        let percentage = Math.round(100 / cardColors.length);
        let gradientColors = [];
        if (data.length === 1) {
          var gradientString = `background-color: ${cardColors}`;
        } else {
          for (let i = 0; i < cardColors.length; ++i) {
            gradientColors[i] =
              cardColors[i] + " " + (percentage * i + percentage) + "%";
            if (i + 1 == cardColors.length) {
              gradientColors[i] =
                cardColors[i] + " " + (percentage * i + 20) + "%";
            }
          }
          var gradientString = `background-image: linear-gradient(${gradientColors})`;
        }
      } else {
        var gradientString = `background-color: transparent`;
      }
      return gradientString;
    },
  },

  methods: {
    addClick() {
      this.emitter.emit("addItemEvent");
    },

    getImageUrl() {
      this.cardback = new URL(`../assets/cardback.png`, import.meta.url).href;
    },
  },
};
</script>

<style>
#gradient {
  margin: 0 auto;
  margin-top: 90px;
  width: 100%;
  height: 150px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

#card {
  position: absolute;
  top: 260px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 400px;
  padding: 25px;
  padding-top: 0;
  padding-bottom: 0;
  font-family: "MedievalSharp";
  background-image: linear-gradient(transparent, var(--tertiary-color) 22%);
  box-shadow: -20px 0 35px -25px black, 20px 0 35px -25px black;
  z-index: 1;
}

#card .card-img {
  float: left;
  margin-top: 20px;
  margin-right: 20px;
  width: 223px;
  height: 310px;
  -webkit-filter: drop-shadow(5px 5px 5px #222);
  filter: drop-shadow(5px 5px 5px #222);
}

#card h2 {
  margin-top: 40px;
  padding: 0;
  color: var(--secondary-color);
  font-size: 15pt;
  font-weight: bold;
}

#card p {
  color: var(--darker-primary-color);
  font-size: 13px;
}

#card .mana-cost {
  position: absolute;
  top: 16px;
  right: 25px;
}

#card .set-symbol {
  position: absolute;
  top: 60px;
  right: 25px;
  width: 32px;
  max-height: 32px;
  cursor: help;
}

#card .oracle-text {
  margin-top: 20px;
  font-weight: bold;
}

#card .flavor-text {
  margin-top: 14px;
  border-top: 1px solid var(--darker-primary-color);
  font-size: 12px;
  font-style: italic;
}

#card .artist {
  position: absolute;
  bottom: 25px;
  left: 25px;
  font-size: 15px;
}

#card .power {
  position: absolute;
  bottom: 25px;
  right: 25px;
  font-weight: bold;
}

#card .add-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 16px;
  color: black;
  font-weight: bold;
}

.card-symbol {
  display: inline-block;
  margin: 1px 1px -1px 1px;
  -webkit-border-radius: 500px;
  border-radius: 500px;
  -webkit-box-shadow: -1px 1px 0 rgba(0, 0, 0, 0.85);
  box-shadow: -1px 1px 0 rgba(0, 0, 0, 0.85);
  text-indent: -999em;
  overflow: hidden;
  width: 14px;
  height: 14px;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  background-position: top left;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  cursor: help;
}

.card-symbol + .card-symbol {
  margin-left: 2px;
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
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
