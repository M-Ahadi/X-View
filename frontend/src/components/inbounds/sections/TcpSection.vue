<template>
  <v-row>
    <v-col>
      <v-checkbox-btn
          v-model="inbound_vars.acceptProxyProtocol"
          color="primary"
          hide-details
          :label="$t('message.accept_proxy_protocol')"
          density="compact"
      />
    </v-col>
    <v-col>
      <v-checkbox-btn
          v-model="inbound_vars.http_masquerade"
          color="primary"
          hide-details
          :label="$t('message.http_masquerade')"
          density="compact"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-checkbox-btn
          v-model="inbound_vars.tls"
          color="primary"
          hide-details
          label="TLS"
          density="compact"
      />
    </v-col>
    <v-col
        v-if="xtls"
    >
      <v-checkbox-btn
          v-model="inbound_vars.xtls"
          color="primary"
          hide-details
          label="XTLS"
          density="compact"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TcpSection",
  props: {
    inbound: {required: true},
    xtls: {required: false, defaults: false}
  },
  data() {
    return {
      inbound_vars: {},
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
    }
  },
  mounted() {
    this.inbound_vars = this.inbound
  },
}
</script>

<style scoped>

</style>