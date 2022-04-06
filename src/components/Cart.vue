<template>
  <div class="absolute top-0 right-10">
    <transition name="el-fade-in" appear>
      <a class="absolute z-10" @click="show = !show">
        <img :src="fullLogo" />
      </a>
    </transition>
    <transition name="el-zoom-in-top" appear>
      <el-table
        v-show="show"
        :data="filterTableData"
        :header-cell-style="{ background: '#c0bc97' }"
        :row-style="{ background: '#f8f8f5' }"
        style="width:270px"
      >
        <el-table-column label="Nom" prop="name" />
        <el-table-column align="right">
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
        name: this.cardDatas.name,
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
        removeColumns: [1],
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
  box-shadow: 0 0 3px 3px var(--darker-primary-color);
}

li {
  font-size: 1.5rem;
  list-style: none;
}
</style>