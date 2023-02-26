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
                    v-model="nginx.enable"
                    color="primary"
                    hide-details
                    density="compact"
                    inline
                    inset
                />
              </v-row>
            </v-col>
          </v-row>
          <v-select
              :label="$t('message.certificate')"
              v-model="nginx.certificate"
              :rules="[rules.required]"
              :items="certificates"
              item-title="name"
              item-value="id"
              solo
              density="compact"
          />

          <v-text-field
              v-model="nginx.domain"

              :label='$t("message.domain_name")'
              solo
              :rules="[rules.required]"
          />
          <v-textarea
              v-model="nginx.extra_config"

              :label='$t("message.extra_config")'
              solo
              :rules="[rules.required]"
          />
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
import SnackbarAlert from "@/components/SnackbarAlert";
import {mapActions, mapGetters} from "vuex";
import {CERTIFICATE, SETTINGS} from "@/store/constants";

export default {
  name: "NginxPage",
  components: {SnackbarAlert},
  data() {
    return {
      show1: false,
      valid: false,
      loading: false,
      showError: false,
      error_message: '',
      certificates: [],
      nginx: {
        certificate: '',
        domain: '',
        extra_config: '',
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
      UpdateNginx: SETTINGS.UPDATE_NGINX,
      LoadNginx: SETTINGS.LOAD_NGINX,
    }),
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
    }),
    async submit() {
      this.showError = false
      this.loading = true
      const Setting = new FormData();
      Setting.append("enable", this.nginx.enable || false);
      Setting.append("certificate", this.nginx.certificate);
      Setting.append("domain", this.nginx.domain);
      Setting.append("extra_config", this.nginx.extra_config);
      await this.UpdateNginx(Setting)
      switch (this.getStatus) {
        case 201:
          this.text = this.$t('message.nginx_saved')
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
          getNginx: 'getNginx',
          getStatus: 'getStatus'
        }
    ),
    ...mapGetters('certificate',
        {
          getCertificateList: 'getCertificateList',
        }),
  },
  async mounted() {
    await this.LoadNginx()
    this.nginx = JSON.parse(JSON.stringify(this.getNginx))
    if (!this.nginx.extra_config) {
      this.nginx.extra_config = "ssl_prefer_server_ciphers on;\n" +
          "ssl_ciphers EECDH+AESGCM:EDH+AESGCM;\n" +
          "ssl_ecdh_curve secp384r1;\n" +
          "ssl_session_cache shared:SSL:10m;"
    }
    await this.listCertificate()
    this.certificates = this.getCertificateList
  },
}
</script>

<style scoped>

</style>