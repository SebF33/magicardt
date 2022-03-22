<template>
  <v-app>
    <v-main>
      <Logo />
      <div class="container mx-auto">
        <div
          class="bg-container"
          :style="{
            backgroundImage: `url(${cardDatas.image_uris.border_crop})`,
          }"
        ></div>
        <Form
          @submit="submitForm"
          v-model="inputCardName"
          :validation-schema="schema"
          @invalid-submit="onInvalidSubmit"
        >
          <TextInput
            name="name"
            type="text"
            label="Nom de la carte :"
            placeholder="(Ex : The Wanderer)"
            success-message="Maintenant cliquez !"
          />
          <button class="submit-btn" type="submit">Afficher</button>
        </Form>
        <Card :cardDatas="cardDatas" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { Form } from "vee-validate";
import * as Yup from "yup";

import Card from "./components/Card.vue";
import Logo from "./components/Logo.vue";
import TextInput from "./components/TextInput.vue";

export default {
  name: "App",

  components: {
    Card,
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
      inputCardName: "",
    };
  },

  methods: {
    // Récupérer les données de l'API à la soumission du formulaire
    submitForm(inputCardName) {
      const name = inputCardName.name;
      this.axios
        .get(`https://api.scryfall.com/cards/named`, {
          params: {
            exact: name,
          },
        })
        .then((response) => {
          this.cardDatas = response.data;
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
        });
    },
  },

  setup() {
    // Comportement si la saisie de l'utilisateur est invalide
    function onInvalidSubmit() {
      const submitBtn = document.querySelector(".submit-btn");
      submitBtn.classList.add("invalid");
      setTimeout(() => {
        submitBtn.classList.remove("invalid");
      }, 1000);
    }

    // Générer un schéma de validation
    // https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    return {
      schema,
      onInvalidSubmit,
    };
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

:root {
  --primary-color: #837c5e;
  --lighter-primary-color: #c0bc97;
  --darker-primary-color: #57523d;
  --secondary-color: #2e1d22;
  --tertiary-color: #fcf8e8;
  --light-color: #f8f8f5;
  --error-color: #e44051;
  --error-bg-color: #fddfe2;
  --success-color: var(--secondary-color);
  --success-bg-color: var(--light-color);
}

@font-face {
  font-family: "Magic";
  src: local("Magic"), url(assets/fonts/Magic.ttf) format("truetype");
}
@font-face {
  font-family: "MedievalSharp";
  src: local("MedievalSharp"),
    url(assets/fonts/MedievalSharp.ttf) format("truetype");
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
  height: 680px;
}

.bg-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
  width: 300px;
  margin: 0px auto;
  padding-bottom: 60px;
}

.submit-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
