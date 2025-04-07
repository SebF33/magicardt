<!-- Cart.vue -->
<template>
  <div
    class="cart-container w-full min-h-96 max-w-[440px] relative max-[1439px]:top-[20px] max-[1439px]:mx-auto lg:top-[-26px] lg:ml-auto lg:mr-8 flex flex-col"
  >
    <transition name="slide-fade" appear>
      <img
        v-show="show"
        :src="fullLogoImage"
        alt="magicardt"
        class="responsive-logo absolute left-0 z-10"
        style="width: 340px"
        draggable="false"
        ondragstart="return false"
      />
    </transition>
    <a
      @click="toggleShow"
      class="glass-btn cursor-pointer absolute z-10"
      style="width: 32.2955px"
      draggable="false"
      ondragstart="return false"
    >
      <img :src="glassImage" alt="magicardt" />
    </a>
    <transition name="el-zoom-in-top" appear>
      <el-table
        v-show="show"
        :data="filterTableData"
        stripe
        :header-cell-style="{ background: '#c0bc97' }"
        :row-style="{ background: '#f8f8f5' }"
        class="responsive-table absolute top-4"
        max-height="320"
        style="width: 440px"
      >
        <el-table-column min-width="36" prop="card_image">
          <template #default="scope">
            <transition name="el-zoom-in-center" appear>
              <a
                class="miniature rounded-sm cursor-pointer"
                @click="setClick(scope.row.card_id)"
              >
                <img
                  :src="scope.row.card_image"
                  :alt="scope.row.card_name"
                  :title="scope.row.card_title"
                  draggable="false"
                  ondragstart="return false"
                />
              </a>
            </transition>
          </template>
        </el-table-column>
        <el-table-column min-width="96" label="Nom" prop="card_name" />
        <el-table-column min-width="24" label="Set" prop="set_icon">
          <template #default="scope">
            <transition name="el-fade-in-linear" appear>
              <img
                class="cursor-help"
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
              @click="store.removeItem(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </transition>
    <transition name="el-fade-in-linear" appear>
      <a
        class="mobileToWork el-button export-btn absolute top-6 right-2"
        title="Créer un fichier Excel"
        v-show="show"
        download="Magicardt.xls"
        href="#"
        id="anchorNewApi-xls"
        @click="openFile('xls')"
        draggable="false"
        ondragstart="return false"
      >
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cGF0aCBkPSJNMTAgNkM4LjkgNiA4IDYuOSA4IDhWNDBDOCA0MS4xIDguOSA0MiAxMCA0MkgzOEMzOS4xIDQyIDQwIDQxLjEgNDAgNDBWMTZMMzAgNkgxMFoiIGZpbGw9IiMyMTczNDYiLz4KICA8cGF0aCBkPSJNMzAgNlYxNkg0MCIgZmlsbD0iIzE1NTY0MyIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgc3R5bGU9ImZvbnQtZmFtaWx5OkFyaWFsLCBzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7ZmlsbDp3aGl0ZTsiPlhMUzwvdGV4dD4KPC9zdmc+"
          alt="xls"
          width="100%"
          height="100%"
          draggable="false"
          ondragstart="return false"
        />
      </a>
    </transition>
  </div>
</template>



<script>
import { computed, onMounted, ref } from "vue";
import { Delete } from "@element-plus/icons-vue";
import ExcellentExport from "excellentexport";
import fullLogoImage from "../assets/full-logo.png";
import glassImage from "../assets/glass.png";
import { useMainStore } from "../utils/mainStore";

export default {
  name: "Cart",

  setup() {
    const store = useMainStore();

    // Accès aux données du store
    const items = computed(() => store.items);

    // Variables locales pour la recherche et l'affichage du tableau
    const search = ref("");
    const show = ref(true);

    const filterTableData = computed(() =>
      items.value.filter(
        (data) =>
          !search.value ||
          data.card_name.toLowerCase().includes(search.value.toLowerCase())
      )
    );

    // Toggle de l'affichage (pour masquer/afficher le tableau)
    const toggleShow = () => {
      show.value = !show.value;
    };

    // 📝 Export de la liste
    const openFile = (format) => {
      const tableElement = document.querySelector(".el-table__body");

      if (!tableElement) {
        console.warn("Table introuvable");
        return;
      }

      // données de la table
      const rows = tableElement.querySelectorAll("tr");
      // en-têtes personnalisés
      const data = [];
      data.push(["Liste des cartes Magicardt"]);
      data.push(["Date :", new Date().toLocaleDateString()]);
      data.push([]);
      data.push(["Nom", "Prix (€)"]);
      // lignes de données
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        const row = [];
        cells.forEach((cell, index) => {
          if (![0, 2].includes(index)) {
            // retirer des colonnes
            const text = cell.innerHTML
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/(<([^>]+)>)/gi, "");
            row.push(text.trim());
          }
        });
        data.push(row);
      }

      // export
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
              array: data,
            },
          },
        ]
      );
    };

    // Clic sur une miniature
    const setClick = (id) => {
      store.fetchCardById(id);
    };

    // Au montage, on récupère les items depuis le store
    onMounted(() => {
      store.fetchCartItems();
    });

    return {
      Delete,
      fullLogoImage,
      glassImage,
      filterTableData,
      search,
      show,
      toggleShow,
      openFile,
      setClick,
      store,
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
  padding: 4px 6px;
}

.export-btn,
.el-button:focus,
.el-button:hover {
  color: black;
}

.export-btn img {
  width: 24px;
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
  display: block;
  margin-bottom: 6px;
  -webkit-filter: drop-shadow(2px 2px 2px #222);
  filter: drop-shadow(2px 2px 2px #222);
  transition: all 0.16s ease-in-out;
}

.el-table .miniature:hover {
  transform: scale(0.9);
}

.el-table .miniature img {
  display: block;
  will-change: transform;
}

li {
  font-size: 1.5rem;
  list-style: none;
}

/* Animations */
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

/* Responsive */
@media (max-width: 500px) {
  .cart-container {
    max-width: 90% !important;
    top: 10px !important;
  }
  .responsive-logo {
    width: 200px !important;
    top: 29px !important;
  }
  .responsive-table {
    width: 100% !important;
  }
  .glass-btn {
    width: 20px !important;
    top: 27px !important;
    left: 163px !important;
  }
}

@media (max-width: 300px) {
  .cart-container {
    display: none;
  }
}
</style>