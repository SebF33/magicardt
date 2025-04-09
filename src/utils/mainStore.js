import axios from "axios";
import { defineStore } from "pinia";
import { formatOracleText } from "./formatOracleText";
import { formatSymbols } from "./formatSymbols";

const apiURL = "https://api.scryfall.com";
const serverURL = "https://magicardt.herokuapp.com/cards";

export const useMainStore = defineStore("main", {
  state: () => ({
    // Données de la carte
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
    // Données du set associé
    setDatas: {
      code: "",
      icon_svg_uri: "",
      name: "",
    },
    // Items du panier (Cart)
    items: [],
    // Liste des sets pour les onglets (Tabs)
    setsList: [],
    // Termes et résultats de recherche
    searchTerm: "",
    searchResults: [],
    selectedCardName: "",
    setTerm: "",
    // Pour gérer l'affichage (Card / Gallery)
    currentComponent: "Card",
    isLoading: false,
  }),

  actions: {
    async fetchCardById(id) {
      try {
        const response = await axios.get(`${apiURL}/cards/${id}`);
        if (response && response.data) {
          this.cardDatas = response.data;
          // formater les données
          if (this.cardDatas.mana_cost) {
            this.cardDatas.mana_cost = formatSymbols(this.cardDatas.mana_cost);
          }
          if (this.cardDatas.oracle_text) {
            this.cardDatas.oracle_text = formatOracleText(this.cardDatas.oracle_text);
          }
          if (this.cardDatas.set) {
            await this.fetchSetData(this.cardDatas.set);
          }
          this.currentComponent = "Card";
        }
      } catch (error) {
        console.error("Erreur lors de l'affichage de la carte :", error);
      }
    },

    async fetchCardByNameAndSet(name, setCode) {
      try {
        const response = await axios.get(`${apiURL}/cards/named`, {
          params: {
            exact: name,
            set: setCode,
          },
        });
        this.cardDatas = response.data;
        // formater les données
        this.cardDatas.mana_cost = formatSymbols(
          this.cardDatas.mana_cost
        );
        this.cardDatas.oracle_text = formatOracleText(
          this.cardDatas.oracle_text
        );
        await this.fetchSetData(this.cardDatas.set);
        this.currentComponent = "Card";
      } catch (error) {
        console.error("Erreur lors de la récupération de la carte :", error);
        // Par exemple, réinitialiser ou afficher un message d’erreur
        this.cardDatas.name = "Carte inexistante 😕";
      }
    },

    async fetchSetData(setCode) {
      try {
        const response = await axios.get(`${apiURL}/sets/${setCode}`);
        if (response && response.data) {
          this.setDatas = response.data;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du set :", error);
      }
    },

    async fetchSetsList() {
      try {
        const response = await axios.get(`${apiURL}/sets`);
        this.setsList = response.data.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des sets :", error);
      }
    },
    
    async addItem() {
      try {
        const response = await axios.post(serverURL, {
          card_id: this.cardDatas.id,
          card_image:
            this.cardDatas?.image_uris?.small ??
            this.cardDatas.card_faces[0].image_uris.small,
          card_image_hd:
            this.cardDatas?.image_uris?.normal ??
            this.cardDatas.card_faces[0].image_uris.normal,
          card_name: this.cardDatas.name,
          card_price:
            this.cardDatas.prices.eur === null
              ? "N/A"
              : this.cardDatas.prices.eur
                  .replace(/(\.0+|0+)$/, "")
                  .replace(".", ","),
          card_title: `${this.cardDatas.name} (${this.cardDatas.set_name})`,
          set_icon: this.setDatas.icon_svg_uri,
          set_name: this.setDatas.name,
        });
        this.items.push(response.data);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'item :", error);
      }
    },
    
    async removeItem(itemId) {
      try {
        await axios.delete(`${serverURL}/${itemId}`);
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'item :", error);
      }
    },

    async fetchCartItems() {
      try {
        const response = await axios.get(serverURL);
        this.items = response.data;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des items du panier :",
          error
        );
      }
    },

    setCurrentComponent(componentName) {
      this.currentComponent = componentName;
    },
  },
});
