<template>
  <v-container
      fluid
      class="bg-grey-lighten-3"
  >
    <v-row>
      <v-col
          md="8"
          ms="12"
          class="mx-auto"
      >
        <v-card
            elevation="3"
            class="my-10  pb-5"
            rounded="xl"
        >
          <v-tabs
              v-model="tab"
              color="deep-purple-accent-4"
          >
            <v-tab value="password">{{ $t("message.password") }}</v-tab>
            <v-tab value="telegram">{{ $t("message.telegram_bot") }}</v-tab>
            <v-tab value="captcha">{{ $t("message.captcha") }}</v-tab>
            <v-tab value="nginx">{{ $t("message.nginx") }}</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item
                value="password"
            >
              <PasswordPage/>
            </v-window-item>
            <v-window-item
                value="telegram"
            >
              <TelegramPage/>
            </v-window-item>
            <v-window-item
                value="captcha"
            >
              <CaptchaPage/>
            </v-window-item>

            <v-window-item
                value="nginx"
            >
              <NginxPage/>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import TelegramPage from "@/components/settings/TelegramPage";
import CaptchaPage from "@/components/settings/CaptchaPage";
import PasswordPage from "@/components/settings/PasswordPage";
import NginxPage from "@/components/settings/NginxPage";

export default {
  name: "PanelSettingsView",
  components: {
    NginxPage,
    PasswordPage,
    TelegramPage,
    CaptchaPage
  },
  data() {
    return {
      tab: null,
      show1: false,
      valid: false,
      loading: false,
      showError: false,
      error_message: '',
      snackbar: false,
    }
  },
  watch: {
    "tab": function () {
      this.showError = false
      this.error_message = ''
    }
  }
}
</script>

<style scoped>

</style>