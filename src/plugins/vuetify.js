// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// https://vuetifyjs.com/en/features/theme/
export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#837c5e",
          lighterPrimary: "#c0bc97",
          lightestPrimary: "#dbd9bd",
          darkerPrimary: "#57523d",
          secondary: "#2e1d22",
          tertiary: "#fcf8e8",
          light: "#f8f8f5",
          background: "#fffcf0",
        },
      },
    },
  },
});
