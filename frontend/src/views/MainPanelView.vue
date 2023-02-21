<template>
  <v-app :theme="theme">


    <v-app-bar>
      <v-btn
          @click="show_menu = !show_menu"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="onClick"
      ></v-btn>
      <v-menu
          location="end"
      >
        <template v-slot:activator="{ props }">
          <v-btn
              v-bind="props"
              flat
              icon="mdi-translate-variant"
          >
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="language in languages"
              :key="language.id"
              :title="language.name"
              density="compact"
              @click="change_language(language)"
          >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main
        class="bg-grey-lighten-3 overflow-y-auto" >
      <v-row>
        <v-col>
          <v-sheet
              rounded="xl"
          >
            <router-view :key="$route.fullPath"></router-view>
          </v-sheet>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import {ref} from "vue";

export default {
  name: "MainPanelView",
  data: () => ({
    is_rtl: false,
    ICON: 'mdi-moon-waning-crescent',
    is_dark: false,
    show_menu: null,
    links: [
      'Dashboard',
      'Messages',
      'Profile',
      'Updates',
    ],
    default_language: 'en',
    languages: [],
    is_authenticate: null
  }),
  methods: {
    ...mapGetters("auth", {'isAuthenticated': 'isAuthenticated'}),
    onClick: function (){
      this.change_theme()
    },
    change_language: function (value){
      this.$i18n.locale = value.id
      this.is_rtl = this.$i18n.getLocaleMessage(value.id).is_rtl;
      localStorage.default_language = value.id
    }
  },
  watch: {
    "theme": function (new_value){
      localStorage.theme = new_value
    }
  },
  mounted() {
    const total_local = this.$i18n.availableLocales
    for (let i = 0; i < total_local.length; i++) {
      this.languages.push({id: total_local[i], name: this.$i18n.getLocaleMessage(total_local[i]).language})
    }
    if (localStorage.default_language){
      this.default_language = localStorage.default_language
    }
    if (localStorage.theme){
      this.theme = localStorage.theme
    }
  },
  setup () {
    const theme = ref('light')
    return {
      theme,
      change_theme : () =>  theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
  }
}
</script>

<style scoped>

</style>