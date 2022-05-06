<template>
  <div class="mobileToWork absolute top-0 right-10">
    <transition name="slide-fade" appear>
      <img
        class="absolute left-0 z-10"
        v-show="show"
        :src="fullLogo"
        alt="magicardt"
        style="width: 340px"
        draggable="false"
        ondragstart="return false"
      />
    </transition>
    <a
      class="glass-btn absolute z-10"
      @click="show = !show"
      style="width: 32.2955px"
      draggable="false"
      ondragstart="return false"
    >
      <img :src="glass" alt="magicardt" />
    </a>
    <transition name="el-zoom-in-top" appear>
      <el-table
        class="absolute top-4"
        v-show="show"
        :data="filterTableData"
        stripe
        :header-cell-style="{ background: '#c0bc97' }"
        :row-style="{ background: '#f8f8f5' }"
        style="width: 440px"
        max-height="410"
      >
        <el-table-column min-width="36" prop="card_image">
          <template #default="scope">
            <transition name="el-zoom-in-center" appear>
              <img
                class="miniature"
                :src="scope.row.card_image"
                :alt="scope.row.card_name"
                :title="scope.row.card_title"
                draggable="false"
                ondragstart="return false"
              />
            </transition>
          </template>
        </el-table-column>
        <el-table-column min-width="96" label="Nom" prop="card_name" />
        <el-table-column min-width="24" label="Set" prop="set_icon">
          <template #default="scope">
            <transition name="el-fade-in-linear" appear>
              <img
                class="set-icon"
                :src="scope.row.set_icon"
                :alt="scope.row.set_name"
                :title="scope.row.set_name"
                draggable="false"
                ondragstart="return false"
              />
            </transition>
          </template>
        </el-table-column>
        <el-table-column
          min-width="40"
          label="Prix (€)"
          prop="card_price"
          align="right"
        />
        <el-table-column min-width="40" align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Filtre" />
          </template>
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="removeItem(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </transition>
  </div>
  <transition name="el-fade-in-linear" appear>
    <a
      class="mobileToWork el-button export-btn absolute top-6 right-12"
      v-show="show"
      download="Magicardt.xls"
      href="#"
      id="anchorNewApi-xls"
      @click="openFile('xls')"
      draggable="false"
      ondragstart="return false"
      >Export</a
    >
  </transition>
</template>

<script>
import axios from "axios";
import { computed, ref } from "vue";
import { Delete } from "@element-plus/icons-vue";
import ExcellentExport from "excellentexport";
import fullLogo from "../assets/full-logo.png";
import glass from "../assets/glass.png";

const serverURL = "https://magicardt.herokuapp.com/cards";

export default {
  name: "Cart",

  props: {
    cardDatas: Object,
    setDatas: Object,
  },

  data() {
    return {
      fullLogo,
      glass,
      itemName: "",
      items: [],
    };
  },

  // Item(s) dans la liste
  async created() {
    try {
      const res = await axios.get(serverURL);
      this.items = res.data;
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    // Suppression d'un item de la liste
    removeItem(row) {
      const id = row.id;
      axios.delete(`${serverURL}/${id}`);
      this.items = this.items.filter((item) => item.id !== id);
    },

    // Ajout d'un item dans la liste
    async addItem() {
      const res = await axios.post(serverURL, {
        card_image: this.cardDatas.image_uris.border_crop,
        card_name: this.cardDatas.name,
        card_price:
          this.cardDatas.prices.eur === null
            ? "N/A"
            : this.cardDatas.prices.eur
                .replace(/(\.0+|0+)$/, "")
                .replace(".", ","),
        card_title: this.cardDatas.name + " (" + this.cardDatas.set_name + ")",
        set_icon: this.setDatas.icon_svg_uri,
        set_name: this.setDatas.name,
      });
      this.items = [...this.items, res.data];
    },

    // Export de la liste
    openFile(format) {
      var datatable = document.getElementsByClassName("el-table__body");
      datatable[0].setAttribute("id", "datatable");
      return ExcellentExport.convert(
        {
          anchor: "anchorNewApi-" + format,
          filename: "Magicardt",
          format: format,
          rtl: true,
        },
        [
          {
            name: "Magicardt",
            from: {
              table: "datatable",
            },
            fixValue: (value, row, col) => {
              let v = value.replace(/<br>/gi, "\n");
              let strippedString = v.replace(/(<([^>]+)>)/gi, "");
              return strippedString;
            },
            removeColumns: [0, 2],
          },
        ]
      );
    },
  },

  mounted() {
    this.emitter.on("addItemEvent", () => {
      this.addItem();
    });
  },

  setup() {
    const items = ref([]);
    const search = ref("");
    const show = ref(true);

    const filterTableData = computed(() =>
      items.value.filter(
        (data) =>
          !search.value ||
          data.card_name.toLowerCase().includes(search.value.toLowerCase())
      )
    );

    return {
      Delete,
      filterTableData,
      items,
      search,
      show,
    };
  },
};
</script>

<style scoped>
/* Boutons */
.export-btn {
  --el-button-bg-color: #837c5e;
  --el-button-border-color: #837c5e;
  --el-button-hover-bg-color: rgb(168, 163, 142);
  --el-button-hover-border-color: rgb(168, 163, 142);
  --el-button-active-bg-color: rgb(105, 99, 75);
  --el-button-active-border-color: rgb(105, 99, 75);
  font-size: 16px;
  font-weight: bold;
}
.export-btn,
.el-button:focus,
.el-button:hover {
  color: black;
}
.glass-btn {
  right: 130px;
  transition: 0.3s ease-in-out;
}
.glass-btn:hover {
  transform: scale(0.92);
}

/* Tableau */
.el-table {
  margin-top: 55px;
  font-family: "Oswald";
  box-shadow: 0 0 3px 3px var(--darker-primary-color);
}
.el-table .miniature {
  margin-bottom: 2px;
  -webkit-filter: drop-shadow(2px 2px 2px #222);
  filter: drop-shadow(2px 2px 2px #222);
}
.el-table .miniature,
.el-table .set-icon {
  cursor: help;
}
li {
  font-size: 1.5rem;
  list-style: none;
}

/* Slide-fade animations */
.slide-fade-enter-active {
  transition: all 0.6s ease-out;
}
.slide-fade-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* 🚧 Mobile à travailler */
@media all and (max-width: 1400px) {
  .mobileToWork {
    display: none;
  }
}
</style>