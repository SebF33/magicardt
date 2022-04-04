<template>
  <v-app>
    <v-main class="min-w-screen min-h-screen flex items-center">
      <Cart :cardDatas="cardDatas" />
      <Logo />
      <div class="inline-block container mx-auto">
        <div
          class="bg-container"
          :style="{
            backgroundImage: `url(${cardDatas.image_uris.border_crop})`,
          }"
        ></div>

        <Form
          v-model="submitTerm"
          @submit="submitForm"
          :validation-schema="schema"
          @invalid-submit="onInvalidSubmit"
        >
          <TextInput
            :modelValue="searchTerm"
            @update:modelValue="searchTerm = $event"
            name="name"
            type="text"
            label="Nom de la carte :"
            placeholder="(Ex : The Wanderer)"
            success-message="Maintenant cliquez !"
          />
          <button class="submit-btn bg-primary-color" type="submit">Afficher</button>
          <p v-if="selectedCardName" class="selected-name text-lg pt-2 absolute">
            Vous avez sélectionné :
            <span class="font-semibold">{{ selectedCardName }}</span>
          </p>
        </Form>

        <ul
          v-if="searchCardNames.length"
          class="autocompletion w-96 rounded bg-light-color border px-4 py-2 space-y-1 absolute z-10"
        >
          <li class="px-1 pt-1 pb-2 font-bold border-b border-gray-200">
            Affichage de {{ searchCardNames.length }} résultat(s) sur
            {{ searchResults.length }}
          </li>
          <li
            v-for="cardName in searchCardNames"
            :key="cardName"
            @click="selectCardName(cardName)"
            class="cursor-pointer hover:bg-lighter-primary-color p-1"
          >{{ cardName }}</li>
        </ul>
        <Card :cardDatas="cardDatas" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import { Form } from "vee-validate";
import { ref, watch, computed } from "vue";
import * as Yup from "yup";
import Card from "./components/Card.vue";
import Cart from "./components/Cart.vue";
import Logo from "./components/Logo.vue";
import TextInput from "./components/TextInput.vue";

export default {
  name: "App",

  components: {
    Card,
    Cart,
    Logo,
    Form,
    TextInput,
  },

  data() {
    return {
      cardDatas: {
        artist: "",
        colors: "",
        flavor_text: "",
        image_uris: { png: "", border_crop: "" },
        loyalty: "",
        mana_cost: "",
        name: "",
        oracle_text: "",
        power: "",
        prices: { eur: "", eur_foil: "" },
        toughness: "",
        type_line: "",
      },
      submitTerm: "",
    };
  },

  methods: {
    // Récupérer les données de l'API à la soumission du formulaire
    submitForm() {
      let selectedCardName = this.selectedCardName;
      let searchTerm = this.searchTerm;

      function name() {
        let name;
        if (selectedCardName === "") {
          name = searchTerm;
        } else {
          name = selectedCardName;
        }
        return name;
      }

      axios
        .get(`https://api.scryfall.com/cards/named`, {
          params: {
            exact: name(),
          },
        })
        .then((response) => {
          this.cardDatas = response.data;
          this.cardDatas.mana_cost = this.formatSymbols(this.cardDatas.mana_cost);
          this.cardDatas.oracle_text = this.formatOracleText(this.cardDatas.oracle_text);
          this.searchCardNames.length = 0;
        })
        .catch(() => {
          this.onInvalidSubmit();
          this.cardDatas.artist = "";
          this.cardDatas.flavor_text = "";
          this.cardDatas.image_uris.png = this.cardback;
          this.cardDatas.loyalty = "";
          this.cardDatas.mana_cost = "";
          this.cardDatas.name = "Nom incomplet ou inexistant 😕";
          this.cardDatas.oracle_text = "";
          this.cardDatas.power = "";
          this.cardDatas.toughness = "";
          this.cardDatas.type_line = "";
          this.searchCardNames.length = 0;
        });
    },
  },

  setup() {
    // Auto-complétion
    const searchResults = ref([]);
    const searchTerm = ref("");
    const selectedCardName = ref("");

    watch(
      () => searchTerm.value,
      (card) =>
        axios
          .get(`https://api.scryfall.com/cards/autocomplete?q=${card}`)
          .then((res) => {
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
      const formattedData = data.replace(/\n/g, '<br/>');
      return formatSymbols(formattedData);
    };

    // Formater les symboles
    function formatSymbols(data) {
      const formattedData = data
        .replace('{T}', '<abbr class="card-symbol card-symbol-T" title="one black mana">{T}</abbr>')
        .replace('{W}', '<abbr class="card-symbol card-symbol-W" title="Mana blanc">{W}</abbr>')
        .replace('{U}', '<abbr class="card-symbol card-symbol-U" title="Mana bleu">{U}</abbr>')
        .replace('{B}', '<abbr class="card-symbol card-symbol-B" title="Mana noir">{B}</abbr>')
        .replace('{R}', '<abbr class="card-symbol card-symbol-R" title="Mana rouge">{R}</abbr>')
        .replace('{G}', '<abbr class="card-symbol card-symbol-G" title="Mana vert">{G}</abbr>')
        .replace('{0}', '<abbr class="card-symbol card-symbol-0" title="Mana : 0">{0}</abbr>')
        .replace('{1}', '<abbr class="card-symbol card-symbol-1" title="Mana générique : 1">{1}</abbr>')
        .replace('{2}', '<abbr class="card-symbol card-symbol-2" title="Mana générique : 2">{2}</abbr>')
        .replace('{3}', '<abbr class="card-symbol card-symbol-3" title="Mana générique : 3">{3}</abbr>')
        .replace('{4}', '<abbr class="card-symbol card-symbol-4" title="Mana générique : 4">{4}</abbr>')
        .replace('{5}', '<abbr class="card-symbol card-symbol-5" title="Mana générique : 5">{5}</abbr>')
        .replace('{6}', '<abbr class="card-symbol card-symbol-6" title="Mana générique : 6">{6}</abbr>')
        .replace('{7}', '<abbr class="card-symbol card-symbol-7" title="Mana générique : 7">{7}</abbr>')
        .replace('{8}', '<abbr class="card-symbol card-symbol-8" title="Mana générique : 8">{8}</abbr>')
        .replace('{9}', '<abbr class="card-symbol card-symbol-9" title="Mana générique : 9">{9}</abbr>')
        .replace('{15}', '<abbr class="card-symbol card-symbol-15" title="Mana générique : 15">{15}</abbr>')
        .replace('{16}', '<abbr class="card-symbol card-symbol-16" title="Mana générique : 16">{16}</abbr>');
      return formattedData;
    };

    // Comportement si la saisie de l'utilisateur est invalide
    function onInvalidSubmit() {
      const submitBtn = document.querySelector(".submit-btn");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    };

    // Générer un schéma de validation
    // https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    return {
      formatOracleText,
      formatSymbols,
      onInvalidSubmit,
      searchCardNames,
      searchResults,
      searchTerm,
      selectCardName,
      selectedCardName,
      schema,
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
  -ms-overflow-style: none; /* IE */
  scrollbar-width: none; /* Firefox */
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
  width: 260px;
  margin: 0px auto;
  padding-bottom: 60px;
}

.selected-name {
  margin-top: 52px;
}

.submit-btn {
  display: inline-block;
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
  cursor: pointer;
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
