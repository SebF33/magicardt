import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./app.css";
import ElementPlus from "element-plus";
import fr from "element-plus/es/locale/lang/fr";
import "element-plus/dist/index.css";
//import { resetMagicardtDatabase } from "./utils/reset-db";

//resetMagicardtDatabase();

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(ElementPlus, { locale: fr });

app.mount("#app");