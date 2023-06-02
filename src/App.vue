<template>
  <v-app>
    <Tabs />

    <Logo class="mt-8" />

    <v-main id="main" class="min-w-screen flex items-center">
      <Cart :cardDatas="cardDatas" :setDatas="setDatas" />

      <div class="inline-block container mx-auto">
        <div
          class="bg-container"
          :style="{
            backgroundImage: `url(${
              cardDatas?.image_uris?.border_crop ??
              cardDatas.card_faces[0].image_uris.border_crop
            })`,
          }"
        ></div>

        <Form
          id="card-form"
          v-model="submitTerm"
          @submit="submitForm"
          :validation-schema="validationSchema"
          @invalid-submit="onInvalidSubmit"
        >
          <TextInput
            :modelValue="searchTerm"
            @update:modelValue="searchTerm = $event"
            name="name"
            type="text"
            label="Nom de la carte :"
            placeholder="Exemple : The Wanderer"
            success-message="Bonne recherche !"
          />

          <v-slide-y-transition>
            <ul
              v-if="searchCardNames.length"
              class="autocompletion w-96 rounded bg-light-color border px-3 py-3 space-y-1 absolute z-20"
            >
              <li class="px-1 pt-1 pb-2 font-bold border-b border-gray-200">
                Affichage de {{ searchCardNames.length }} résultat(s) sur
                {{ searchResults.length }}
              </li>
              <li
                v-for="cardName in searchCardNames"
                :key="cardName"
                @click="selectCardName(cardName)"
                class="hover:bg-lightest-primary-color p-1 cursor-pointer"
              >
                {{ cardName }}
              </li>
            </ul>
          </v-slide-y-transition>

          <el-select
            class="sets-list font-medievalsharp absolute z-10"
            v-model="setTerm"
            filterable
            clearable
            placeholder="Précisez le set (facultatif)"
          >
            <el-option
              v-for="item in setsList"
              :key="item.setTerm"
              :label="item.name"
              :value="item.code"
            />
          </el-select>

          <p
            v-if="selectedCardName"
            class="selected-name text-lg pt-2 absolute"
          >
            Vous avez sélectionné :
            <span class="font-semibold">{{ selectedCardName }}</span>
          </p>

          <button
            class="submit-btn bg-primary-color cursor-pointer"
            type="submit"
          >
            Afficher
          </button>
        </Form>
        <component
          :is="currentComponent"
          :cardDatas="cardDatas"
          :key="componentKey"
          :setCode="setCode"
          :setDatas="setDatas"
        />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { Form } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import * as zod from "zod";
import Card from "./components/Card.vue";
import Cart from "./components/Cart.vue";
import Gallery from "./components/Gallery.vue";
import Logo from "./components/Logo.vue";
import Tabs from "./components/Tabs.vue";
import TextInput from "./components/TextInput.vue";

const apiURL = "https://api.scryfall.com";

const initialCardState = () => {
  return {
    cardDatas: {
      artist: "",
      card_faces: { 0: { image_uris: { png: "", border_crop: "" } } },
      colors: "",
      flavor_text: "",
      id: "",
      image_uris: { png: "", border_crop: "" },
      loyalty: "",
      mana_cost: "",
      name: "",
      oracle_text: "",
      power: "",
      prices: { eur: "", eur_foil: "" },
      set: "",
      set_name: "",
      toughness: "",
      type_line: "",
    },
    setDatas: {
      code: "",
      icon_svg_uri: "",
      name: "",
    },
  };
};

const initialGalleryState = () => {
  return {
    setCode: "",
  };
};

export default {
  name: "App",

  components: {
    Card,
    Cart,
    Gallery,
    Logo,
    Form,
    Tabs,
    TextInput,
  },

  data() {
    return {
      cardDatas: {
        artist: "",
        card_faces: { 0: { image_uris: { png: "", border_crop: "" } } },
        colors: "",
        flavor_text: "",
        id: "",
        image_uris: { png: "", border_crop: "" },
        loyalty: "",
        mana_cost: "",
        name: "",
        oracle_text: "",
        power: "",
        prices: { eur: "", eur_foil: "" },
        set: "",
        set_name: "",
        toughness: "",
        type_line: "",
      },
      componentKey: 0,
      currentComponent: "Card",
      setCode: "",
      setDatas: {
        code: "",
        icon_svg_uri: "",
        name: "",
      },
      submitTerm: "",
    };
  },

  methods: {
    // Réinitialiser le composant "carte" ou "galerie"
    forceRerender() {
      this.componentKey += 1;
    },

    // Réinitialiser les données de la carte
    resetCard() {
      Object.assign(this.$data, initialCardState());
    },

    // Réinitialiser les données de la galerie
    resetGallery() {
      Object.assign(this.$data, initialGalleryState());
    },

    // Afficher la carte qui provient de la galerie
    showCard(id) {
      axios
        .get(`${apiURL}/cards/${id}`)
        .then((response) => {
          this.cardDatas = response.data;
          this.cardDatas.mana_cost = this.formatSymbols(
            this.cardDatas.mana_cost
          );
          this.cardDatas.oracle_text = this.formatOracleText(
            this.cardDatas.oracle_text
          );
        })
        .then(async () => {
          await axios
            .get(`${apiURL}/sets/${this.cardDatas.set}`)
            .then((res) => {
              this.setDatas = res.data;
            });
        })
        .catch((error) => {
          console.log(error);
        });

      this.currentComponent = "Card";
    },

    // Afficher la galerie
    showGallery(code) {
      this.selectedCardName = "";

      this.setCode = code;

      axios
        .get(`${apiURL}/sets/${this.setCode}`)
        .then((response) => {
          this.setDatas = response.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.currentComponent = "Gallery";
    },

    // Récupérer les données de la carte à la soumission du formulaire
    submitForm() {
      this.resetCard();

      let code = this.setTerm;
      let name =
        this.selectedCardName === "" ? this.searchTerm : this.selectedCardName;

      axios
        .get(`${apiURL}/cards/named`, {
          params: {
            exact: name,
            set: code,
          },
        })
        .then((response) => {
          this.cardDatas = response.data;
          this.cardDatas.mana_cost = this.formatSymbols(
            this.cardDatas.mana_cost
          );
          this.cardDatas.oracle_text = this.formatOracleText(
            this.cardDatas.oracle_text
          );
        })
        .then(async () => {
          await axios
            .get(`${apiURL}/sets/${this.cardDatas.set}`)
            .then((res) => {
              this.setDatas = res.data;
            });
        })
        .catch(() => {
          this.onInvalidSubmit();
          this.cardDatas.artist = "";
          this.cardDatas.flavor_text = "";
          this.cardDatas.id = "";
          this.cardDatas.image_uris.png = this.cardback;
          this.cardDatas.loyalty = "";
          this.cardDatas.mana_cost = "";
          this.cardDatas.name = "Carte inexistante 😕";
          this.cardDatas.oracle_text = "";
          this.cardDatas.power = "";
          this.cardDatas.set = "";
          this.cardDatas.set_name = "";
          this.cardDatas.toughness = "";
          this.cardDatas.type_line = "";
          this.setDatas.icon_svg_uri = "";
          this.setDatas.name = "";
        });

      this.currentComponent = "Card";
    },
  },

  // Évènements
  mounted() {
    this.emitter.on("showCardFromCartEvent", (id) => {
      setTimeout(() => {
        this.showCard(id);
      }, 300);
    });
    this.emitter.on("showCardFromGalleryEvent", (id) => {
      setTimeout(() => {
        this.resetCard();
        this.showCard(id);
      }, 500);
    });
    this.emitter.on("showGalleryEvent", (code) => {
      setTimeout(() => {
        this.resetGallery();
        this.showGallery(code);
        this.forceRerender();
      }, 100);
    });
  },

  setup() {
    const searchResults = ref([]);
    const searchTerm = ref("");
    const selectedCardName = ref("");
    const setsList = ref([]);
    const setTerm = ref("");

    onMounted(async () => {
      await axios.get(`${apiURL}/sets`).then((res) => {
        setsList.value = res.data.data;
      });
    });

    // Auto-complétion
    watch(
      () => searchTerm.value,
      (card) =>
        axios.get(`${apiURL}/cards/autocomplete?q=${card}`).then((res) => {
          searchResults.value = res.data.data;
        })
    );

    const searchCardNames = computed(() => {
      if (searchTerm.value === "") {
        return [];
      }
      let matches = 0;
      return searchResults.value.filter((cardName) => {
        if (
          cardName.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
          matches < 10
        ) {
          matches++;
          return cardName;
        }
      });
    });

    const selectCardName = (cardName) => {
      selectedCardName.value = cardName;
      searchTerm.value = "";
    };

    // Formater le texte Oracle
    function formatOracleText(data) {
      const formattedData = data.replace(/\n/g, "<br/>");
      return formatSymbols(formattedData);
    }

    // Formater la symbologie
    function formatSymbols(data) {
      const formattedData = data
        .replaceAll(
          "{T}",
          '<abbr class="card-symbol card-symbol-T" title="Engagez ce permanent">{T}</abbr>'
        )
        .replaceAll(
          "{Q}",
          '<abbr class="card-symbol card-symbol-Q" title="Dégagez ce permanent">{Q}</abbr>'
        )
        .replaceAll(
          "{E}",
          '<abbr class="card-symbol card-symbol-E" title="Marqueur "énergie"">{E}</abbr>'
        )
        .replaceAll(
          "{CHAOS}",
          '<abbr class="card-symbol card-symbol-CHAOS" title="Chaos">{CHAOS}</abbr>'
        )
        .replaceAll(
          "{A}",
          '<abbr class="card-symbol card-symbol-A" title="Marqueur "gland"">{A}</abbr>'
        )
        .replaceAll(
          "{X}",
          '<abbr class="card-symbol card-symbol-X" title="Mana générique : X">{X}</abbr>'
        )
        .replaceAll(
          "{Y}",
          '<abbr class="card-symbol card-symbol-Y" title="Mana générique : Y">{Y}</abbr>'
        )
        .replaceAll(
          "{Z}",
          '<abbr class="card-symbol card-symbol-Z" title="Mana générique : Z">{Z}</abbr>'
        )
        .replaceAll(
          "{½}",
          '<abbr class="card-symbol card-symbol-HALF" title="Mana générique : ½">{½}</abbr>'
        )
        .replaceAll(
          "{0}",
          '<abbr class="card-symbol card-symbol-0" title="Mana : 0">{0}</abbr>'
        )
        .replaceAll(
          "{1}",
          '<abbr class="card-symbol card-symbol-1" title="Mana générique : 1">{1}</abbr>'
        )
        .replaceAll(
          "{2}",
          '<abbr class="card-symbol card-symbol-2" title="Mana générique : 2">{2}</abbr>'
        )
        .replaceAll(
          "{3}",
          '<abbr class="card-symbol card-symbol-3" title="Mana générique : 3">{3}</abbr>'
        )
        .replaceAll(
          "{4}",
          '<abbr class="card-symbol card-symbol-4" title="Mana générique : 4">{4}</abbr>'
        )
        .replaceAll(
          "{5}",
          '<abbr class="card-symbol card-symbol-5" title="Mana générique : 5">{5}</abbr>'
        )
        .replaceAll(
          "{6}",
          '<abbr class="card-symbol card-symbol-6" title="Mana générique : 6">{6}</abbr>'
        )
        .replaceAll(
          "{7}",
          '<abbr class="card-symbol card-symbol-7" title="Mana générique : 7">{7}</abbr>'
        )
        .replaceAll(
          "{8}",
          '<abbr class="card-symbol card-symbol-8" title="Mana générique : 8">{8}</abbr>'
        )
        .replaceAll(
          "{9}",
          '<abbr class="card-symbol card-symbol-9" title="Mana générique : 9">{9}</abbr>'
        )
        .replaceAll(
          "{10}",
          '<abbr class="card-symbol card-symbol-10" title="Mana générique : 10">{10}</abbr>'
        )
        .replaceAll(
          "{11}",
          '<abbr class="card-symbol card-symbol-11" title="Mana générique : 11">{11}</abbr>'
        )
        .replaceAll(
          "{12}",
          '<abbr class="card-symbol card-symbol-12" title="Mana générique : 12">{12}</abbr>'
        )
        .replaceAll(
          "{13}",
          '<abbr class="card-symbol card-symbol-13" title="Mana générique : 13">{13}</abbr>'
        )
        .replaceAll(
          "{14}",
          '<abbr class="card-symbol card-symbol-14" title="Mana générique : 14">{14}</abbr>'
        )
        .replaceAll(
          "{15}",
          '<abbr class="card-symbol card-symbol-15" title="Mana générique : 15">{15}</abbr>'
        )
        .replaceAll(
          "{16}",
          '<abbr class="card-symbol card-symbol-16" title="Mana générique : 16">{16}</abbr>'
        )
        .replaceAll(
          "{17}",
          '<abbr class="card-symbol card-symbol-17" title="Mana générique : 17">{18}</abbr>'
        )
        .replaceAll(
          "{18}",
          '<abbr class="card-symbol card-symbol-18" title="Mana générique : 18">{18}</abbr>'
        )
        .replaceAll(
          "{19}",
          '<abbr class="card-symbol card-symbol-19" title="Mana générique : 19">{19}</abbr>'
        )
        .replaceAll(
          "{20}",
          '<abbr class="card-symbol card-symbol-20" title="Mana générique : 20">{20}</abbr>'
        )
        .replaceAll(
          "{100}",
          '<abbr class="card-symbol card-symbol-100" title="Mana générique : 100">{100}</abbr>'
        )
        .replaceAll(
          "{1000000}",
          '<abbr class="card-symbol card-symbol-1000000" title="Mana générique : 1000000">{1000000}</abbr>'
        )
        .replaceAll(
          "{∞}",
          '<abbr class="card-symbol card-symbol-INFINITY" title="Mana générique : ∞">{∞}</abbr>'
        )
        .replaceAll(
          "{W}",
          '<abbr class="card-symbol card-symbol-W" title="Mana blanc">{W}</abbr>'
        )
        .replaceAll(
          "{U}",
          '<abbr class="card-symbol card-symbol-U" title="Mana bleu">{U}</abbr>'
        )
        .replaceAll(
          "{B}",
          '<abbr class="card-symbol card-symbol-B" title="Mana noir">{B}</abbr>'
        )
        .replaceAll(
          "{R}",
          '<abbr class="card-symbol card-symbol-R" title="Mana rouge">{R}</abbr>'
        )
        .replaceAll(
          "{G}",
          '<abbr class="card-symbol card-symbol-G" title="Mana vert">{G}</abbr>'
        )
        .replaceAll(
          "{C}",
          '<abbr class="card-symbol card-symbol-C" title="Mana incolore">{C}</abbr>'
        )
        .replaceAll(
          "{S}",
          '<abbr class="card-symbol card-symbol-S" title="Mana neige">{S}</abbr>'
        );
      return formattedData;
    }

    // Comportement si la saisie de l'utilisateur est invalide
    function onInvalidSubmit() {
      const submitBtn = document.querySelector(".submit-btn");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    }

    // Générer un schéma de validation
    const validationSchema = toFormValidator(
      zod.object({
        name: zod
          .string("Ce champ est requis...")
          .min(2, { message: "Saisissez 2 caractères minimum..." }),
      })
    );

    return {
      formatOracleText,
      formatSymbols,
      onInvalidSubmit,
      searchCardNames,
      searchResults,
      searchTerm,
      selectCardName,
      selectedCardName,
      setsList,
      setTerm,
      validationSchema,
    };
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  background: var(--tertiary-color);
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#app {
  font-family: "Magic";
  font-size: 20px;
  width: 100%;
  height: 100%;
}

.container {
  position: relative;
  max-width: 100% !important;
  height: 680px;
}

.autocompletion,
.bg-container,
.selected-name,
.sets-list,
.submit-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.autocompletion {
  box-shadow: 0 0 3px 3px var(--darker-primary-color);
}

.bg-container {
  width: 480px;
  height: 680px;
  opacity: 0.32;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  mask-image: radial-gradient(closest-side, var(--tertiary-color), transparent);
  -webkit-mask-image: radial-gradient(
    closest-side,
    var(--tertiary-color),
    transparent
  );
  -o-mask-image: radial-gradient(
    closest-side,
    var(--tertiary-color),
    transparent
  );
  -moz-mask-image: radial-gradient(
    closest-side,
    var(--tertiary-color),
    transparent
  );
}

form {
  margin: 0px auto;
  padding-bottom: 60px;
  width: 260px;
}

/* Liste des sets */
.sets-list {
  width: 260px;
}
.sets-list .el-input__inner {
  background-color: unset;
  color: var(--success-color);
  box-shadow: unset;
}
.el-popper {
  box-shadow: 0 0 3px 3px var(--darker-primary-color) !important;
}
.el-select-dropdown__item {
  font-family: "MedievalSharp";
}

/* Bouton du formulaire */
.submit-btn {
  display: inline-block;
  margin-top: 70px;
  border-radius: 5px;
  padding: 8px 20px;
  font-family: "MedievalSharp";
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--secondary-color);
  text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.1);
  background-color: var(--primary-color);
  box-shadow: 0px 5px 0px 0px var(--darker-primary-color);
  text-decoration: none;
}
.submit-btn:active {
  transform: translate(-50%, 5px);
  -webkit-transform: translate(-50%, 5px);
  box-shadow: 0px 1px 0px 0px;
}
.submit-btn:hover {
  background-color: var(--lighter-primary-color);
}
.submit-btn.invalid {
  background-color: var(--error-bg-color);
  box-shadow: 0px 5px 0px 0px #e48a93;
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}
@keyframes shake {
  0% {
    transform: translate(-49%, 1px);
  }

  10% {
    transform: translate(-51%, -2px);
  }

  20% {
    transform: translate(-53%, 0px);
  }

  30% {
    transform: translate(-47%, 2px);
  }

  40% {
    transform: translate(-49%, -1px);
  }

  50% {
    transform: translate(-51%, 2px);
  }

  60% {
    transform: translate(-53%, 1px);
  }

  70% {
    transform: translate(-47%, 1px);
  }

  80% {
    transform: translate(-51%, -1px);
  }

  90% {
    transform: translate(-49%, 2px);
  }

  100% {
    transform: translate(-49%, -2px);
  }
}
</style>
