<!-- App.vue -->
<template>
  <v-app>
    <Tabs />
    <Logo />
    <v-main id="main" class="min-w-screen flex items-center">
      <Cart />

      <div class="inline-block container mx-auto">
        <!-- Fond basé sur l'image de la carte -->
        <div
          class="bg-container"
          :style="{
            backgroundImage: `url(${
              cardDatas?.image_uris?.border_crop ??
              cardDatas.card_faces[0].image_uris.border_crop
            })`,
          }"
        ></div>

        <!-- Formulaire de recherche / affichage de carte -->
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
            :placeholder="placeholder"
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

        <!-- Affichage dynamique du composant (Card ou Gallery) via le store -->
        <component :is="store.currentComponent" :key="componentKey" />
      </div>
    </v-main>
  </v-app>
</template>



<script>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { Form } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { useMainStore } from "./utils/mainStore";
import * as zod from "zod";

import Card from "./components/Card.vue";
import Cart from "./components/Cart.vue";
import Gallery from "./components/Gallery.vue";
import Logo from "./components/Logo.vue";
import Tabs from "./components/Tabs.vue";
import TextInput from "./components/TextInput.vue";

const apiURL = "https://api.scryfall.com";

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

  setup() {
    const store = useMainStore();

    // Accès aux données du store
    const cardDatas = computed(() => store.cardDatas);

    // États locaux pour le formulaire et l'autocomplétion
    const submitTerm = ref("");
    const searchTerm = ref("");
    const selectedCardName = ref("");
    const searchResults = ref([]);
    const setsList = ref([]);
    const setTerm = ref("");

    // Clé pour forcer le re-render du composant dynamique
    const componentKey = ref(0);

    // Placeholder pour le champ de recherche
    const placeholder = ref("");
    const randomPlaceholder = () => {
      const list = ["Lotus", "Mox", "The Wanderer", "Urza"];
      const randomIndex = Math.floor(Math.random() * list.length);
      placeholder.value = "Exemple : " + list[randomIndex];
    };
    randomPlaceholder();

    // Auto-complétion : mise à jour des résultats de recherche
    watch(searchTerm, (newTerm) => {
      axios.get(`${apiURL}/cards/autocomplete?q=${newTerm}`).then((res) => {
        searchResults.value = res.data.data;
      });
    });

    const searchCardNames = computed(() => {
      if (searchTerm.value === "") return [];
      let matches = 0;
      return searchResults.value.filter((cardName) => {
        if (
          cardName.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
          matches < 10
        ) {
          matches++;
          return true;
        }
        return false;
      });
    });

    const selectCardName = (cardName) => {
      selectedCardName.value = cardName;
      searchTerm.value = "";
    };

    // Récupération des sets pour le select
    onMounted(async () => {
      const res = await axios.get(`${apiURL}/sets`);
      setsList.value = res.data.data;
    });

    // Comportement en cas de soumission invalide
    const onInvalidSubmit = () => {
      const submitBtn = document.querySelector(".submit-btn");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    };

    // Schéma de validation pour le formulaire
    const validationSchema = toFormValidator(
      zod.object({
        name: zod.string("Ce champ est requis...").min(2, {
          message: "Saisissez 2 caractères minimum...",
        }),
      })
    );

    // Afficher une carte via le store
    const showCard = async (id) => {
      try {
        await store.fetchCardById(id);
      } catch (error) {
        console.error("Erreur lors de l'affichage de la carte :", error);
      }
    };

    // Afficher la galerie via le store
    const showGallery = async (code) => {
      selectedCardName.value = "";
      setTerm.value = code;
      try {
        await store.fetchSetData(code);
      } catch (error) {
        console.error(error);
      }
      store.setCurrentComponent("Gallery");
    };

    // Soumission du formulaire : récupération d'une carte par nom et set
    const submitForm = () => {
      // choix du nom à rechercher
      const code = setTerm.value;
      const name =
        selectedCardName.value === ""
          ? searchTerm.value
          : selectedCardName.value;
      store.fetchCardByNameAndSet(name, code);
      store.setCurrentComponent("Card");
    };

    // Permet de forcer le re-render du composant dynamique si nécessaire
    const forceRerender = () => {
      componentKey.value++;
    };

    return {
      store,
      submitTerm,
      searchTerm,
      selectedCardName,
      searchResults,
      searchCardNames,
      selectCardName,
      setsList,
      setTerm,
      validationSchema,
      onInvalidSubmit,
      forceRerender,
      submitForm,
      componentKey,
      placeholder,
      cardDatas,
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
  background: var(--background-color);
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
.sets-list .el-select__wrapper {
  background-color: unset;
  color: var(--secondary-color);
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
