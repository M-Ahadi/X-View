<template>
  <v-container
      fluid
      class="bg-grey-lighten-3"
  >
    <v-row>
      <v-col
          md="4"
          ms="12"
          class="mx-auto"
      >
        <v-card
            elevation="3"
            class="my-10  pb-5"
            max-width="600px"
            rounded="xl"

        >
          <v-card-title class="headline" justify>
            {{ $t("message.login") }}
          </v-card-title>
          <v-container>
            <v-form
                @submit.prevent="submit"
                v-model="valid"
            >
              <v-text-field
                  :label='$t("message.username")'
                  :placeholder='$t("message.username")'
                  :rules="[rules.required]"
                  v-model="username"
                  solo
              ></v-text-field>
              <v-text-field
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append-inner="show1 = !show1"
                  :label='$t("message.password")'
                  :placeholder='$t("message.username")'
                  solo
                  v-model="password"
                  :rules="[rules.required]"
              ></v-text-field>
              <section
                  v-if="sitekey"
                  style="display: grid; place-items: center; padding-bottom: 15px"
              >
                <vue-recaptcha
                    ref="recaptcha"
                    :sitekey="sitekey"
                    :loadRecaptchaScript="true"
                    @verify="onCaptchaVerified"
                    @expired="onCaptchaExpired"
                >
                </vue-recaptcha>
              </section>
              <v-btn
                  type="submit"
                  block
                  color="secondary"
                  :loading="loading"
                  elevation="3"
              >{{ $t("message.login") }}
              </v-btn>
            </v-form>
            <p v-if="showError" id="error">{{ error_message }}</p>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {VueRecaptcha} from 'vue-recaptcha';
import {SETTINGS, USER} from "@/store/constants";

export default {
  name: "LoginView",
  components: {
    VueRecaptcha
  },
  props: ['is_authenticated'],
  data() {
    return {
      recaptchaToken: true,
      sitekey: '',
      from: null,
      show1: false,
      valid: false,
      loading: false,
      username: '',
      password: '',
      showError: false,
      error_message: '',
      rules: {
        required: value => !!value || this.$t('message.required'),
      },

    }
  },
  methods: {
    ...mapActions("auth", {
      LogIn: USER.LOGIN
    }),
    ...mapActions("settings", {
      LoadCaptchaSitekey: SETTINGS.LOAD_SITE_KEY,
    }),
    async submit() {
      this.loading = true
      const User = new FormData();
      User.append("username", this.username);
      User.append("password", this.password);
      if (this.sitekey) {
        User.append("recaptchaToken", this.recaptchaToken);
      }
      await this.LogIn(User)
      switch (this.getStatus) {
        case 200: {
          this.showError = false
          this.loading = false
          this.$router.go({name: 'inbounds'});
          break
        }
        case 500: {
          this.error_message = this.$t("message.service_unavailable")
          this.showError = true
          this.loading = false
          break
        }
        case 400: {
          this.error_message = this.$t("message.login_failed")
          this.showError = true
          this.loading = false
          break
        }
      }
      // this.onCaptchaExpired()


    },
    total_form_valid() {
      return this.valid && !!this.recaptchaToken
    },
    onCaptchaVerified: function (recaptchaToken) {
      this.recaptchaToken = recaptchaToken
    },
    onCaptchaExpired: function () {
      this.recaptchaToken = null
      this.$refs.recaptcha.reset();
    }

  },
  async mounted() {
    await this.LoadCaptchaSitekey()
    this.sitekey = this.getSiteKey
  },
  computed: {
    ...mapGetters('auth',
        {
          getStatus: 'getStatus'
        }),
    ...mapGetters('settings',
        {
          getSiteKey: 'getSiteKey',
        }
    )
  },

}
</script>

<style scoped>

</style>
