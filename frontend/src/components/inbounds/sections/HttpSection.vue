<template>
  <v-row>
    <v-col>
      <v-text-field
          v-model="inbound_vars.host"
          :label="$t('message.host')"
          density="compact"
      />
    </v-col>
    <v-col>
      <v-text-field
          v-model="inbound_vars.path"
          :label="$t('message.path')"
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
  </v-row>
</template>

<script>

export default {
  name: "HttpSection",
  props: {
    inbound: {required: true},
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