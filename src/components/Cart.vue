<template>
  <div class="absolute top-0 right-10">
    <transition name="el-fade-in" appear>
      <a class="absolute left-0 z-10" @click="show = !show" style="width:340px">
        <img :src="fullLogo" alt="magicardt" />
      </a>
    </transition>
    <transition name="el-zoom-in-top" appear>
      <el-table
        class="absolute top-4"
        v-show="show"
        :data="filterTableData"
        stripe
        :header-cell-style="{ background: '#c0bc97' }"
        :row-style="{ background: '#f8f8f5' }"
        style="width:440px"
      >
        <el-table-column min-width="36" prop="image">
          <template #default="scope">
            <img
              class="miniature"
              :src="scope.row.image"
              :alt="scope.row.name"
              :title="scope.row.title"
            />
          </template>
        </el-table-column>
        <el-table-column min-width="74" label="Nom" prop="name" />
        <el-table-column min-width="30" label="Set" prop="set" />
        <el-table-column min-width="40" label="Prix" prop="price" />
        <el-table-column min-width="50" align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Rechercher" />
          </template>
          <template #default="scope">
            <el-button size="small" type="danger" :icon="Delete" @click="removeItem(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </transition>
  </div>
  <div class="absolute bottom-20 right-10 z-10">
    <a
      class="absolute top-0 right-10"
      download="Magicardt.xls"
      href="#"
      id="anchorNewApi-xls"
      @click="openFile('xls')"
    >Export</a>
  </div>
</template>

<script>
import axios from "axios";
import { computed, ref } from 'vue';
import { Delete } from '@element-plus/icons-vue'
import ExcellentExport from 'excellentexport';
import fullLogo from "../assets/full-logo.png";

const serverURL = "https://magicardt.herokuapp.com/cards";

export default {
  name: "Cart",

  props: {
    cardDatas: Object,
  },

  data() {
    return {
      fullLogo,
      items: [],
      itemName: "",
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
        image: this.cardDatas.image_uris.border_crop,
        name: this.cardDatas.name,
        price: this.cardDatas.prices.eur,
        set: this.cardDatas.set,
        set_name: this.cardDatas.set_name,
        title: this.cardDatas.name + " (" + this.cardDatas.set_name + ")",
      });
      this.items = [...this.items, res.data];
    },

    // Export de la liste
    openFile(format) {
      var datatable = document.getElementsByClassName('el-table__body');
      datatable[0].setAttribute('id', 'datatable');
      return ExcellentExport.convert({
        anchor: 'anchorNewApi-' + format,
        filename: 'Magicardt',
        format: format,
        rtl: true,
      }, [{
        name: 'Magicardt',
        from: {
          table: 'datatable'
        },
        fixValue: (value, row, col) => {
          let v = value.replace(/<br>/gi, "\n");
          let strippedString = v.replace(/(<([^>]+)>)/gi, "");
          return strippedString;
        },
        removeColumns: [0],
      }]);
    },
  },

  mounted() {
    this.emitter.on("addItemEvent", () => {
      this.addItem();
    });
  },

  setup() {
    const items = ref([])
    const search = ref('')
    const show = ref(true)

    const filterTableData = computed(() =>
      items.value.filter(
        (data) =>
          !search.value ||
          data.name.toLowerCase().includes(search.value.toLowerCase())
      )
    )

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
.el-table {
  margin-top: 55px;
  font-family: "Oswald";
  box-shadow: 0 0 3px 3px var(--darker-primary-color);
}

.el-table .miniature {
  margin-bottom: 2px;
  -webkit-filter: drop-shadow(2px 2px 2px #222);
  filter: drop-shadow(2px 2px 2px #222);
  cursor: help;
}

li {
  font-size: 1.5rem;
  list-style: none;
}
</style>