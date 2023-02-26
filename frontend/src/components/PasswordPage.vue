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
import {USER} from "@/store/constants";
import SnackbarAlert from "@/components/SnackbarAlert";

export default {
  name: "PasswordPage",
  components: {SnackbarAlert},
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
      showError: false,
      error_message: '',
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
    async submit() {
      this.showError = false
      this.loading = true
      const Setting = new FormData();
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
    }
  },
  computed: {
    ...mapGetters('settings',
        {
          getStatus: 'getStatus'
        }
    )
  },
}
</script>

<style scoped>

</style>