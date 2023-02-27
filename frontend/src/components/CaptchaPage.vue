<template>
  <v-container fluid>
    <v-row>
      <v-col
          class="mx-auto"
      >
        <v-form
            @submit.prevent="submit"
            v-model="valid"
        >
          <v-row>
            <v-col>
              <v-row class="pb-5">
                <v-label
                    class="px-3"
                    text="Enable"
                />
                <v-switch
                    v-model="captcha.enable"
                    color="primary"
                    hide-details
                    density="compact"
                    inline
                    inset
                />
              </v-row>
            </v-col>
          </v-row>
          <v-text-field
              v-model="captcha.site_key"
              :label='$t("message.site_key")'
              solo
              :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
              v-model="captcha.secret_key"
              :label='$t("message.secret_key")'
              solo
              :rules="[rules.required]"
          ></v-text-field>
          <v-btn
              type="submit"
              block
              color="secondary"
              :loading="loading"
              elevation="3"
              :disabled="!valid"
          >{{ $t("message.save") }}
          </v-btn>
        </v-form>
        <v-row
            class="py-4"
        >
          <v-col class="text-start">
            <v-icon>mdi-information</v-icon>
            <a href="https://www.google.com/recaptcha/admin/" target="_blank">{{ $t('message.get_captcha') }}</a>
          </v-col>
        </v-row>
        <p v-if="showError" id="error">{{ error_message }}</p>
      </v-col>
    </v-row>
  </v-container>
  <SnackbarAlert
      v-if="snackbar"
      :text="text"
      @ShowSnackbar="snackbar = $event"
  ></SnackbarAlert>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {SETTINGS} from "@/store/constants";
import SnackbarAlert from "@/components/SnackbarAlert";

export default {
  name: "CaptchaPage",
  components: {SnackbarAlert},
  data() {
    return {
      show1: false,
      valid: false,
      loading: false,
      showError: false,
      error_message: '',
      captcha: {
        enable: false,
        secret_key: '',
        site_key: '',
      },
      snackbar: false,
      text: '',
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
    }
  },
  methods: {
    ...mapActions("settings", {
      UpdateCaptcha: SETTINGS.UPDATE_CAPTCHA,
      LoadCaptcha: SETTINGS.LOAD_CAPTCHA,
    }),
    async submit() {
      this.showError = false
      this.loading = true
      const Setting = new FormData();

      Setting.append("enable", this.captcha.enable);
      Setting.append("site_key", this.captcha.site_key);
      Setting.append("secret_key", this.captcha.secret_key);
      await this.UpdateCaptcha(Setting)
      switch (this.getStatus) {
        case 201:
          this.text = this.$t('message.captcha_saved')
          this.snackbar = true
          break
        case 400:
          this.showError = true
          this.error_message = this.$t('message.unauthorized')
          break
        default:
          this.showError = true
          this.error_message = this.$t('message.error_change')
          break
      }
      this.loading = false
    }
  },
  computed: {
    ...mapGetters('settings',
        {
          getStatus: 'getStatus'
        }
    ),
  }
}
</script>

<style scoped>

</style>