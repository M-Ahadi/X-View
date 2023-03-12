<template>
  <v-row>
    <v-col>
      <v-text-field
          :label="$t('message.request_version')"
          v-model="inbound_vars.request_version"
          :model-value="inbound_vars.request_version || '1.1'"
          density="compact"
      />
      <v-text-field
          :label="$t('message.request_method')"
          v-model="inbound_vars.request_method"
          :model-value="inbound_vars.request_method || 'GET'"
          density="compact"
      />
      <v-text-field
          :label="$t('message.request_path')"
          v-model="inbound_vars.request_path"
          :model-value="inbound_vars.request_path || '/'"
          density="compact"
      />
      <v-text-field
          :label="$t('message.response_version')"
          v-model="inbound_vars.response_version"
          :model-value="inbound_vars.response_version || '1.1'"
          density="compact"
      />
      <v-text-field
          :label="$t('message.response_status')"
          v-model="inbound_vars.response_status"
          :model-value="inbound_vars.response_status || 200"
          density="compact"
      />
      <v-text-field
          :label="$t('message.response_status_description')"
          v-model="inbound_vars.response_status_description"
          :model-value="inbound_vars.response_status_description || 'OK'"
          density="compact"
      />
    </v-col>
  </v-row>
  <v-row>
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
</template>

<script>
export default {
  name: "HttpMasqueradeSection",
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