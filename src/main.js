import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import mitt from "mitt";
import "./app.css";
import ElementPlus from "element-plus";
import fr from "element-plus/es/locale/lang/fr";
import "element-plus/dist/index.css";

const emitter = mitt();
const app = createApp(App);

app.use(vuetify);
app.use(ElementPlus, {
  locale: fr,
});

app.config.globalProperties.emitter = emitter;

app.mount("#app");