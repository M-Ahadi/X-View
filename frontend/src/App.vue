<template>
  <v-theme-provider :theme="theme"  >
  <v-locale-provider   :rtl="is_rtl" >
    <v-container
    >
    <v-app>
      <v-navigation-drawer
          v-model="show_menu"
          v-if="is_authenticate"
          class="text-start"
          expand-on-hover
          elevation="3"
          :width="320"
      >
              <v-list density="compact">
                <v-list-item
                    link
                    :to="{name: 'system_status'}"
                    :title="$t('message.system_status')"
                    density="compact"
                    prepend-icon="mdi-car-speed-limiter"
                    active-color="primary"
                    rounded="xl"
                />
                <v-list-item
                    link
                    :to="{name: 'certificates'}"
                    :title="$t('message.certificate')"
                    density="compact"
                    prepend-icon="mdi-file-document-multiple-outline"
                    active-color="primary"
                    rounded="xl"
                />
                <v-list-item
                    link
                    :to="{name: 'inbounds'}"
                    :title="$t('message.inbound_list')"
                    density="compact"
                    prepend-icon="mdi-format-list-bulleted"
                    active-color="primary"
                    rounded="xl"
                />
                <v-list-item
                    link
                    :to="{name: 'system_settings'}"
                    :title="$t('message.panel_settings')"
                    prepend-icon="mdi-cog-outline"
                ></v-list-item>
<!--                <v-list-group value="panel_settings">-->
<!--                  <v-list-item-->
<!--                      link-->
<!--                      :to="{name: 'system_settings'}"-->
<!--                      :title="$t('message.password')"-->
<!--                      active-color="primary"-->
<!--                      rounded="xl"-->
<!--                      prepend-icon="mdi-onepassword"-->
<!--                  />-->

<!--                </v-list-group>-->
<!--                <v-list-item-->
<!--                    link-->
<!--                    :to="{name: 'system_settings'}"-->
<!--                    :title="$t('message.panel_settings')"-->
<!--                    density="compact"-->
<!--                    prepend-icon="mdi-cog-outline"-->
<!--                    active-color="primary"-->
<!--                    rounded="xl"-->
<!--                />-->
                <v-list-item
                    link
                    href="https://github.com/M-Ahadi/X-View"
                    :title="$t('message.github')"
                    density="compact"
                    prepend-icon="mdi-github"
                    target="_blank"
                />
                <v-divider class="my-2"></v-divider>

                <v-list-item
                    link
                    color="grey-lighten-4"
                    :to="{name: 'logout'}"
                    :title="$t('message.logout')"
                    density="compact"
                    prepend-icon="mdi-power"
                >
                </v-list-item>
              </v-list>

      </v-navigation-drawer>
      <v-app-bar>
        <v-btn
            v-if="is_authenticate"
            @click="show_menu = !show_menu && is_authenticate"
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
                <router-view :key="$route.fullPath" ></router-view>
              </v-sheet>
            </v-col>
          </v-row>
      </v-main>
    </v-app>
    </v-container>
  </v-locale-provider>
  </v-theme-provider>
</template>

<script>
import {mapGetters} from "vuex";
import { ref } from 'vue'

export default {
  data: () => ({
    is_rtl: false,
    ICON: 'mdi-moon-waning-crescent',
    is_dark: false,
    show_menu: true,
    links: [
      'Dashboard',
      'Messages',
      'Profile',
      'Updates',
    ],
    default_language: 'en',
    languages: [],
    is_authenticate: false
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
    },
  },
  watch: {
    "theme": function (new_value){
      localStorage.theme = new_value
    },
  },
  mounted() {
    const total_local = this.$i18n.availableLocales
    for (let i = 0; i < total_local.length; i++) {
      this.languages.push({id: total_local[i], name: this.$i18n.getLocaleMessage(total_local[i]).language})
    }
    if (localStorage.default_language){
      this.default_language = localStorage.default_language
      this.$i18n.locale = localStorage.default_language
      this.is_rtl = this.$i18n.getLocaleMessage(this.default_language).is_rtl;
    }
    if (localStorage.theme){
      this.theme = localStorage.theme
    }
    this.is_authenticate = this.isAuthenticated()
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
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #eeeeee;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
