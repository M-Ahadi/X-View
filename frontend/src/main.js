import { createApp } from 'vue'
import App from './App.vue'
// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from "@/router";
import store from "@/store"

import i18n from './i18n'


const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
})

createApp(App)
    .use(vuetify)
    .use(i18n)
    .use(router)
    .use(store)
    .mount('#app')