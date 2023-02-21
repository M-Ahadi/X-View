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
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item
                value="password"
            >
              <v-container fluid>
                <v-row>
                  <v-col
                      class="mx-auto"
                  >
                    <v-form
                        @submit.prevent="submit"
                        v-model="valid"
                    >
                      <v-text-field
                          :type="show1 ? 'text' : 'password'"
                          :label='$t("message.old_password")'
                          solo
                          v-model="password_old"
                          :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                          :type="show1 ? 'text' : 'password'"
                          :label='$t("message.new_password")'
                          solo
                          v-model="password1"
                          :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                          v-if="!show1"
                          :type="show1 ? 'text' : 'password'"
                          :label='$t("message.new_password")'
                          solo
                          v-model="password2"
                          :rules="[rules.required, rules.same_password]"
                      ></v-text-field>
                      <v-checkbox
                          v-model="show1"
                          color="primary"
                          hide-details
                          :label="$t('message.show_password')"
                          density="compact"
                      >
                      </v-checkbox>
                      <v-btn
                          type="submit"
                          block
                          color="secondary"
                          :loading="loading"
                          elevation="3"
                      >{{ $t("message.save") }}
                      </v-btn>
                    </v-form>
                    <p v-if="showError" id="error">{{ error_message }}</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
            <v-window-item
                value="telegram"
            >
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
                      >{{ $t("message.save") }}
                      </v-btn>
                    </v-form>
                    <p v-if="showError" id="error">{{ error_message }}</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
            <v-window-item
                value="captcha"
            >
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
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar
      v-model="snackbar"
  >
    {{ text }}

    <template v-slot:actions>
      <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {SETTINGS, USER} from "@/store/constants";

export default {
  name: "PanelSettingsView",
  data() {
    return {
      tab: null,
      show1: false,
      valid: false,
      loading: false,
      username: '',
      password_old: '',
      password1: '',
      password2: '',
      telegram: {
        token: '',
        chatid: '',
        enable: false
      },
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
        same_password: value => ((value === this.password1) || this.show1) || this.$t('message.password_mismatch')
      },

    }
  },
  methods: {
    ...mapActions("auth", {
      ChangePassword: USER.CHANGE_PASSWORD
    }),
    ...mapActions("settings", {
      UpdateCaptcha: SETTINGS.UPDATE_CAPTCHA,
      LoadCaptcha: SETTINGS.LOAD_CAPTCHA,
      UpdateTelegram: SETTINGS.UPDATE_TELEGRAM,
      LoadTelegram: SETTINGS.LOAD_TELEGRAM,
    }),
    async submit() {
      this.showError = false
      this.loading = true
      const Setting = new FormData();
      switch (this.tab) {
        case "password":
          Setting.append("password", this.password_old)
          Setting.append("password1", this.password1)
          if (this.show1) {
            Setting.append("password2", this.password1)
          } else {
            Setting.append("password2", this.password2)
          }

          await this.ChangePassword(Setting)
          switch (this.getStatus) {
            case 200:
              this.text = this.$t('message.password_saved')
              this.snackbar = true
              break
            case 400:
              this.showError = true
              this.error_message = this.$t('message.unauthorized')
              break
            default:
              this.showError = true
              this.error_message = this.$t('message.error_change_password')
              break
          }
          break
        case "telegram":
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
              break
          }
          break
        case "captcha":
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
          break
      }
      this.loading = false
    }
  },
  computed: {
    ...mapGetters('settings',
        {
          getTelegram: 'getTelegram',
          getCaptcha: 'getCaptcha',
          getStatus: 'getStatus'
        }
    )
  },
  async mounted() {
    await this.LoadCaptcha()
    this.captcha = JSON.parse(JSON.stringify(this.getCaptcha))
    await this.LoadTelegram()
    this.telegram = JSON.parse(JSON.stringify(this.getTelegram))
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