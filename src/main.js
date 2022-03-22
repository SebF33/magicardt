import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import axios from "axios";

loadFonts();

const app = createApp(App).use(vuetify);

app.config.globalProperties.axios = axios;

app.mount("#app");
