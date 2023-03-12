<template>
    <v-text-field
        v-model="inbound_vars.serverName"
        :label="$t('message.domain_name')"
        density="compact"
    />
    <v-row>
      <v-col
          cols="2"
      >
        <v-label
            class="px-2"
            text="ALPN:"
        />
      </v-col>
      <v-col
          cols="3"
      >
        <v-checkbox-btn
            v-model="inbound_vars.h2"
            label="h2"
            value="h2"
            density="compact"
        />
      </v-col>
      <v-col
          cols="3"
      >
        <v-checkbox-btn
            v-model="inbound_vars.h1"
            label="http/1.1"
            value="http/1.1"
            density="compact"
        />
      </v-col>
    </v-row>
    <v-select
        :label="$t('message.certificate')"
        v-model="inbound_vars.certificate"
        :rules="[rules.required]"
        :items="certificates"
        item-title="name"
        item-value="id"
        solo
        density="compact"
    />
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {CERTIFICATE} from "@/store/constants";

export default {
  name: "TlsSection",
  props: {
    inbound: {required: true, default: null}
  },
  data() {
    return {
      inbound_vars: '',
      certificates: [],
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
    }
  },
  computed: {
    ...mapGetters('certificate',
        {
          getCertificateList: 'getCertificateList',
        }),
  },
  methods: {
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
    }),
  },
  async mounted() {
    await this.listCertificate()
    this.certificates = this.getCertificateList
    this.inbound_vars = this.inbound
  },

}
</script>

<style scoped>

</style>