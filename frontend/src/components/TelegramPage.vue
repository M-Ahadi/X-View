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
                    v-model="telegram.enable"
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
              v-model="telegram.token"
              :label='$t("message.telegram_token")'
              solo
              :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
              v-model="telegram.chatid"
              :label='$t("message.telegram_chatid")'
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
  name: "TelegramPage",
  components: {SnackbarAlert},
  data() {
    return {
      show1: false,
      valid: false,
      loading: false,
      showError: false,
      error_message: '',
      telegram: {
        token: '',
        chatid: '',
        enable: false,
      },
      snackbar: false,
      text: '',
      rules: {
        required: value => !!value || this.$t('message.required')
      },
    }
  },
  methods: {
    ...mapActions("settings", {
      UpdateTelegram: SETTINGS.UPDATE_TELEGRAM,
      LoadTelegram: SETTINGS.LOAD_TELEGRAM,
    }),
    async submit() {
      this.showError = false
      this.loading = true
      const Setting = new FormData();
      Setting.append("enable", this.telegram.enable);
      Setting.append("token", this.telegram.token);
      Setting.append("chatid", this.telegram.chatid);
      await this.UpdateTelegram(Setting)
      switch (this.getStatus) {
        case 201:
          this.text = this.$t('message.telegram_saved')
          this.snackbar = true
          break
        case 400:
          this.showError = true
          this.error_message = this.$t('message.unauthorized')
          break
        default:
          this.showError = true
          this.error_message = this.$t('message.error_change')
      }
      this.loading = false
    },
    ShowSnackbar(value){
      this.snackbar = value
    }
  },
  computed: {
    ...mapGetters('settings',
        {
          getTelegram: 'getTelegram',
          getStatus: 'getStatus'
        }
    )
  },
  async mounted() {
    await this.LoadTelegram()
    this.telegram = JSON.parse(JSON.stringify(this.getTelegram))
  },
}
</script>

<style scoped>

</style>