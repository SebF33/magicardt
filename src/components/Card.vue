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
            <div
              v-show="showMagnifier"
              class="card-magnifier-glass data-html2canvas-ignore"
            ></div>
          </transition>
          <img
            id="my-card"
            v-show="isLoaded"
            :src="(cardDatas?.image_uris?.png ?? cardDatas.card_faces[0].image_uris.png) || cardback"
            :alt="(cardDatas?.image_uris?.png ?? cardDatas.card_faces[0].image_uris.png) || cardback"
            @load="handleZoom"
            @error="handleZoom"
            class="card-img data-html2canvas-ignore"
            draggable="false"
            ondragstart="return false"
          />
        </div>
        <transition name="bounce" appear>
          <h2 v-if="cardDatas.name">{{ cardDatas.name }}</h2>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <p
            v-if="cardDatas.mana_cost"
            v-html="cardDatas.mana_cost"
            class="mana-cost"
          ></p>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <p v-if="cardDatas.type_line">{{ cardDatas.type_line }}</p>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <a
            v-if="setDatas.icon_svg_uri"
            @click="setClick(setDatas.code)"
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
            v-if="cardDatas.oracle_text"
            v-html="cardDatas.oracle_text"
            class="oracle-text"
          ></p>
        </transition>
        <div v-if="cardDatas.flavor_text" class="flavor-separator"></div>
        <transition name="scroll-x-transition" appear>
          <p
            v-if="cardDatas.flavor_text"
            v-show="delayShow"
            class="flavor-text"
          >
            {{ cardDatas.flavor_text }}
          </p>
        </transition>
        <transition name="el-fade-in-linear" appear>
          <span class="artist font-bold" v-if="cardDatas.artist"
            >Artiste(s) : {{ cardDatas.artist }}</span
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
        <div class="card-buttons">
          <transition name="el-fade-in-linear" appear>
            <el-button
              v-if="cardDatas.id"
              @click="showMagnifier = !showMagnifier"
              class="tiny-glass-btn data-html2canvas-ignore"
              title="Activer/désactiver la loupe"
              color="#837c5e"
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
              v-if="cardDatas.id"
              @click="addClick"
              class="add-btn data-html2canvas-ignore text-lighterPrimary font-bold shadow-inner"
              color="#837c5e"
              >Ajouter
            </el-button>
          </transition>
          <transition name="el-fade-in-linear" appear>
            <el-button
              v-if="cardDatas.id"
              @click="createPdf"
              :disabled="pdfGenerating"
              class="pdf-file-btn data-html2canvas-ignore"
              title="Créer un document PDF"
              color="#837c5e"
            >
              <img
                v-if="!pdfGenerating"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cGF0aCBkPSJNMTAgNkM4LjkgNiA4IDYuOSA4IDhWNDBDOCA0MS4xIDguOSA0MiAxMCA0MkgzOEMzOS4xIDQyIDQwIDQxLjEgNDAgNDBWMTZMMzAgNkgxMFoiIGZpbGw9IiNGRjAwMDAiLz4KICA8cGF0aCBkPSJNMzAgNlYxNkg0MCIgZmlsbD0iI0NDMDAwMCIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgc3R5bGU9ImZvbnQtZmFtaWx5OkFyaWFsLCBzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7ZmlsbDp3aGl0ZTsiPlBERjwvdGV4dD4KPC9zdmc+"
                alt="pdf"
                width="100%"
                height="100%"
                draggable="false"
                ondragstart="return false"
              />
              <TinySpinner v-else :animation-duration="2000" :size="24" />
            </el-button>
          </transition>
        </div>
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
import { createFadedImage } from "../utils/createFadedImage";
import html2canvas from "html2canvas";
import icon from "../assets/icon.png";
import { jsPDF } from "jspdf";
import { replaceCardSymbolsWithImg } from "../utils/replaceCardSymbolsWithImg";
import Spinner from "./Spinner.vue";
import tinyGlass from "../assets/tiny-glass.png";
import TinySpinner from "./TinySpinner.vue";
import VueLoadImage from "vue-load-image";

export default {
  name: "Card",

  components: {
    Spinner,
    TinySpinner,
    "vue-load-image": VueLoadImage,
  },

  props: {
    cardDatas: Object,
    setCode: String,
    setDatas: Object,
  },

  data() {
    return {
      cardback: "",
      delayShow: false,
      icon,
      isLoaded: false,
      pdfGenerating: false,
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
      const data = this.cardDatas.colors;
      let gradientString = "";

      if (data !== "") {
        const cardColors = data.reduce((colors, color) => {
          switch (color) {
            case "W":
              colors.push("#f3f2f9");
              break;
            case "U":
              colors.push("#246bc6");
              break;
            case "B":
              colors.push("#3b3b3f");
              break;
            case "R":
              colors.push("#ce372d");
              break;
            case "G":
              colors.push("#006744");
              break;
            default:
              colors.push(color);
          }
          return colors;
        }, []);

        const percentage = Math.round(100 / cardColors.length);
        let gradientColors = [];

        if (data.length === 1) {
          gradientString = `background-color: ${cardColors[0]}`;
        } else {
          for (let i = 0; i < cardColors.length; ++i) {
            gradientColors[i] =
              cardColors[i] + " " + (percentage * i + percentage) + "%";
            if (i + 1 === cardColors.length) {
              gradientColors[i] =
                cardColors[i] + " " + (percentage * i + 20) + "%";
            }
          }
          gradientString = `background-image: linear-gradient(${gradientColors})`;
        }
      } else {
        gradientString = `background-color: transparent`;
      }

      return gradientString;
    },
  },

  methods: {
    addClick() {
      this.emitter.emit("addItemEvent");
    },

    // 📜 Création d'un document PDF de la carte
    async createPdf() {
      this.pdfGenerating = true;

      const artImageUrl = this.cardDatas.image_uris.art_crop + "?not-from-cache-please";
      const cardImageUrl = this.cardDatas.image_uris.png + "?not-from-cache-please";
      const iconImage = this.icon;
      const title = `${this.cardDatas.name}_${this.setDatas.code}`;

      const dom = document.getElementById("card");
      const that = this; // pour garder le contexte dans les callbacks
      
      // clone provisoire du DOM original..
      const clonedDom = dom.cloneNode(true);
      document.body.appendChild(clonedDom);
      clonedDom.querySelectorAll(".data-html2canvas-ignore").forEach(el => { el.style.visibility = "hidden"; });
      clonedDom.id = "card-clone";
      clonedDom.style.position = "fixed";
      clonedDom.style.left = "-9999px";
      clonedDom.style.backgroundImage = "none";
      clonedDom.style.boxShadow = "none";
      // ..pour le remplacement à la volée des symboles en base64
      await replaceCardSymbolsWithImg(clonedDom);

      html2canvas(clonedDom, {
        allowTaint: true,
        backgroundColor: "#fcf8e8",
        height: 600,
        scale: 1.8,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        width: 1000
      }).then(async function (canvas) {
        clonedDom.remove();

        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        const pdfWidth = ((contentWidth + 10) / 2) * 0.75;
        const pdfHeight = ((contentHeight + 200) / 2) * 0.75;
        const imgWidth = pdfWidth;
        const imgHeight = (contentHeight / 2) * 0.75;

        const pdf = new jsPDF("", "pt", [pdfWidth, pdfHeight]);
        const pageData = canvas.toDataURL("image/jpeg", 1.0);

        // création des images
        const pageArt = new Image();
        pageArt.crossOrigin = "Anonymous";
        pageArt.src = artImageUrl;

        const pageCard = new Image();
        pageCard.crossOrigin = "Anonymous";
        pageCard.src = cardImageUrl;

        const pageIcon = new Image();
        pageIcon.src = iconImage;

        // chargement simultané des 3 images supplémentaires
        Promise.all([
          loadImage(pageArt),
          loadImage(pageCard),
          loadImage(pageIcon)
        ]).then(([artImg, cardImg, iconImg]) => {
          const scale = 0.52;
          const artHeight = artImg.naturalHeight * scale;
          const artWidth = artImg.naturalWidth * scale;
          const centerX = (pdf.internal.pageSize.getWidth() - artWidth) / 2;
          const fadedArt = createFadedImage(artImg, artWidth, artHeight, 2, "rgba(252, 248, 232, 1)");

          // fond
          pdf.setFillColor(252, 248, 232);
          pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

          // ajout de toutes les images dans le PDF
          pdf.addImage(iconImg, "png", 192, 10, 96, 96);
          pdf.addImage(fadedArt, "png", centerX, 135, artWidth, artHeight);
          pdf.addImage(pageData, "jpeg", 0, 400, imgWidth, imgHeight);
          pdf.addImage(cardImg, "jpeg", 14, 413, 156.1, 217.91);

          pdf.save(title + ".pdf");
        }).catch(error => {
          console.error("Erreur lors du chargement des images :", error);
          alert("Une erreur est survenue lors de la génération du PDF.");
        }).finally(() => {
          that.pdfGenerating = false;
        });
      }).catch(error => {
        console.error("Erreur lors de la capture du DOM :", error);
        alert("Impossible de capturer la carte pour le PDF.");
        that.pdfGenerating = false;
      });

      function loadImage(img) {
        return new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Erreur de chargement : ${img.src}`));
        });
      }
    },

    // Dos de la carte
    getCardBackUrl() {
      this.cardback = new URL(`../assets/cardback.webp`, import.meta.url).href;
    },

    setClick(code) {
      this.emitter.emit("showGalleryEvent", code);
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

  mounted() {
    setTimeout(() => {
      this.delayShow = true;
    }, 1200);
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

#card, #card-clone {
  position: absolute;
  top: 260px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 700px;
  height: 400px;
  padding: 25px;
  padding-top: 0;
  padding-bottom: 0;
  font-family: "MedievalSharp";
  background-image: linear-gradient(transparent, var(--tertiary-color) 22%);
  box-shadow: -20px 0 35px -25px black, 20px 0 35px -25px black;
}

.card-magnifier-container {
  position: relative;
}

#card .card-img, #card-clone .card-img {
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
  z-index: 100;
  border-radius: 50%;
  cursor: none;
  width: 110px;
  height: 110px;
  border: 2px solid var(--secondary-color);
  box-shadow: 0 -1px 1px var(--tertiary-color), 0 2px 2px var(--secondary-color),
    inset 0 0 1px var(--darker-primary-color),
    inset 0 1px 0.125em var(--primary-color),
    inset 0 2px 0.25em var(--lighter-primary-color),
    inset 0 -1px 0.125em var(--primary-color),
    inset 0 -2px 0.25em var(--lighter-primary-color),
    inset 0 0 0 0.375em var(--secondary-color);
}

#card h2, #card-clone h2 {
  margin-top: 40px;
  padding: 0;
  color: var(--secondary-color);
  font-size: 15pt;
  font-weight: bold;
}

#card p, #card-clone p {
  color: var(--darker-primary-color);
  font-size: 13px;
}

#card .mana-cost, #card-clone .mana-cost {
  position: absolute;
  top: 16px;
  right: 25px;
}

#card .set-symbol, #card-clone .set-symbol {
  position: absolute;
  display: block;
  top: 60px;
  right: 26px;
  width: 30px;
  max-height: 30px;
}

#card .set-symbol img, #card-clone .set-symbol img {
  display: block;
  transition: all 0.2s ease-in-out;
}

#card .set-symbol img:hover, #card-clone .set-symbol img:hover {
  transform: scale(1.18);
}

#card .oracle-text, #card-clone .oracle-text {
  margin-top: 20px;
  font-weight: bold;
}

#card .flavor-separator, #card-clone .flavor-separator {
  margin-top: 14px;
  border-top: 1px solid var(--darker-primary-color);
}

#card .flavor-text, #card-clone .flavor-text {
  margin-top: 4px;
  font-size: 12px;
  font-style: italic;
}

#card .artist, #card-clone .artist {
  position: absolute;
  max-width: 230px;
  bottom: 25px;
  left: 25px;
  font-size: 13px;
}

#card .power, #card-clone .power {
  position: absolute;
  bottom: 25px;
  right: 25px;
  font-weight: bold;
}

/* Boutons */
#card .card-buttons, #card-clone .card-buttons {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}

#card .add-btn, #card-clone .add-btn {
  text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000,
    -1px -1px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000;
}

#card .pdf-file-btn, #card-clone .pdf-file-btn,
#card .tiny-glass-btn, #card-clone .tiny-glass-btn {
  padding: 4px 6px;
}

#card .pdf-file-btn img, #card-clone .pdf-file-btn img,
#card .tiny-glass-btn img, #card-clone .tiny-glass-btn img {
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
  background-repeat: no-repeat;
  background-color: transparent;
  background-origin: border-box;
  background-size: contain;
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
