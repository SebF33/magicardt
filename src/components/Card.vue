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
        <div class="card-magnifier-container">
          <transition name="el-fade-in-linear" appear>
            <div class="card-magnifier-glass" v-show="showMagnifier"></div
          ></transition>
          <img
            id="my-card"
            class="card-img"
            v-show="isLoaded"
            :src="cardDatas.image_uris.png || cardback"
            @load="handleZoom"
            @error="handleZoom"
            :alt="cardDatas.image_uris.png || cardback"
            draggable="false"
            ondragstart="return false"
          />
        </div>
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
          <a
            v-if="setDatas.icon_svg_uri"
            @click="setClick"
            class="set-symbol cursor-pointer"
          >
            <img
              :src="setDatas.icon_svg_uri"
              width="32"
              :alt="setDatas.name"
              :title="setDatas.name"
              draggable="false"
              ondragstart="return false"
          /></a>
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
          <span class="power" v-if="cardDatas.power">
            {{ cardDatas.power }}/{{ cardDatas.toughness }}
          </span>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <span class="power" v-if="cardDatas.loyalty"
            >Loyauté : {{ cardDatas.loyalty }}</span
          >
        </transition>
        <transition name="el-fade-in-linear" appear>
          <el-button
            class="tiny-glass-btn"
            color="#837c5e"
            v-if="cardDatas.id"
            @click="showMagnifier = !showMagnifier"
          >
            <img
              :src="tinyGlass"
              alt="glass"
              draggable="false"
              ondragstart="return false"
            />
          </el-button>
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
import tinyGlass from "../assets/tiny-glass.png";
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
      isLoaded: false,
      showMagnifier: false,
      tinyGlass,
    };
  },

  created: function () {
    this.getCardBackUrl();
  },

  computed: {
    // 🏳‍🌈 Création du bandeau de couleur(s)
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

    setClick() {
      this.emitter.emit("showGalleryEvent");
    },

    getCardBackUrl() {
      this.cardback = new URL(`../assets/cardback.webp`, import.meta.url).href;
    },

    // 🔍 Zoom sur la carte
    handleZoom() {
      this.isLoaded = true;

      function magnify(id, zoom) {
        var img, glass, w, h, bw;
        img = document.getElementById(id);
        glass = document.getElementsByClassName("card-magnifier-glass")[0];

        if (typeof glass != "undefined" && glass != null) {
          glass.style.backgroundImage = "url('" + img.src + "')";
          glass.style.backgroundRepeat = "no-repeat";
          glass.style.backgroundSize =
            img.width * zoom + "px " + img.height * zoom + "px";
          bw = 3;
          w = parseInt(getComputedStyle(glass).width.replace(/\D/g, "")) / 2;
          h = parseInt(getComputedStyle(glass).height.replace(/\D/g, "")) / 2;
          glass.addEventListener("mousemove", moveMagnifier);
          img.addEventListener("mousemove", moveMagnifier);
          glass.addEventListener("touchmove", moveMagnifier);
          img.addEventListener("touchmove", moveMagnifier);

          function moveMagnifier(e) {
            var pos, x, y;
            e.preventDefault();
            pos = getCursorPosition(e);
            x = pos.x;
            y = pos.y;
            if (x > img.width - w / zoom) {
              x = img.width - w / zoom;
            }
            if (x < w / zoom) {
              x = w / zoom;
            }
            if (y > img.height - h / zoom) {
              y = img.height - h / zoom;
            }
            if (y < h / zoom) {
              y = h / zoom;
            }
            glass.style.left = x - w + "px";
            glass.style.top = y - h + "px";
            glass.style.backgroundPosition =
              "-" + (x * zoom - w + bw) + "px -" + (y * zoom - h + bw) + "px";
          }

          function getCursorPosition(e) {
            var a,
              x = 0,
              y = 0;
            e = e || window.event;
            a = img.getBoundingClientRect();
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return { x: x, y: y };
          }
        }
      }

      setTimeout(function () {
        magnify("my-card", 3);
      }, 1000);
    },
  },
};
</script>

<style>
#gradient {
  margin: 0 auto;
  margin-top: 180px;
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

.card-magnifier-container {
  position: relative;
}

#card .card-img {
  float: left;
  margin-top: 20px;
  margin-right: 20px;
  width: 223px;
  -webkit-filter: drop-shadow(5px 5px 5px #222);
  filter: drop-shadow(5px 5px 5px #222);
}

/* Loupe */
.card-magnifier-glass {
  position: absolute;
  border-radius: 50%;
  cursor: none;
  width: 110px;
  height: 110px;
  z-index: 100;
  border: 2px solid var(--secondary-color);
  box-shadow: 0 -1px 1px var(--tertiary-color), 0 2px 2px var(--secondary-color),
    inset 0 0 1px var(--darker-primary-color),
    inset 0 1px 0.125em var(--primary-color),
    inset 0 2px 0.25em var(--lighter-primary-color),
    inset 0 -1px 0.125em var(--primary-color),
    inset 0 -2px 0.25em var(--lighter-primary-color),
    inset 0 0 0 0.375em var(--secondary-color);
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
  display: block;
  top: 60px;
  right: 26px;
  width: 30px;
  max-height: 30px;
}
#card .set-symbol img {
  display: block;
  transition: all .20s ease-in-out;
}
#card .set-symbol img:hover {
  transform: scale(1.18);
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

/* Boutons */
#card .add-btn,
#card .tiny-glass-btn {
  position: absolute;
  bottom: 16px;
}
#card .add-btn {
  left: 50%;
  transform: translateX(-50%);
  color: black;
  font-weight: bold;
}
#card .tiny-glass-btn {
  left: 38%;
  padding: 4px 6px;
}
#card .tiny-glass-btn img {
  width: 24px;
}

/* Symboles */
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
