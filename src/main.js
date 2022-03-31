import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./app.css";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

const app = createApp(App).use(vuetify);

app.mount("#app");
