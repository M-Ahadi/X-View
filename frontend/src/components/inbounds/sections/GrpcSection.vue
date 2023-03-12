<template>
  <v-text-field
      :label="$t('message.service_name')"
      v-model="inbound_vars.service_name"
      density="compact"
  />
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
  </v-row>
</template>

<script>
export default {
  name: "GrpcSection",
  props: {
    inbound: {required: true}
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