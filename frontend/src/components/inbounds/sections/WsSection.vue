<template>
  <v-text-field
      v-model="inbound_vars.path"
      :label="$t('message.path')"
      density="compact"
  />
  <v-row>
    <v-col>
      {{ $t('message.add_header') }}
      <v-btn
          variant="flat"
          size="small"
          @click="createNewHeader()"
          icon="mdi-plus-box"
      />
    </v-col>
  </v-row>
  <v-row
      v-for="item in inbound_vars.request_headers"
      :key="item.id"
      class="py-0 pa-0"
      dense
  >
    <v-col
        cols="5"
    >
      <v-text-field
          v-model="item.header_name"
          :label="$t('message.name')"
          density="compact"
      />
    </v-col>
    <v-col
        cols="5"
        density="compact"
    >
      <v-text-field
          v-model="item.header_value"
          :label="$t('message.value')"
          density="compact"
      />
    </v-col>
    <v-col
        cols="2"
        density="compact"
    >
      <v-btn
          variant="flat"
          size="small"
          @click="removeHeader(item.id)"
          icon="mdi-minus-box"
      />
    </v-col>
  </v-row>
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
import {CreateNewHeader, RemoveHeader} from "@/store/modules/config_generators";

export default {
  name: "WsSection",
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
  methods:{
    removeHeader: function (header_id) {
      this.inbound_vars = RemoveHeader(header_id, this.inbound_vars)
    },
    createNewHeader: function () {
      this.inbound_vars = CreateNewHeader(this.inbound_vars)
    },
  },
  mounted() {
    this.inbound_vars = this.inbound
    this.inbound_vars.request_headers = this.inbound_vars.request_headers ? this.inbound_vars.request_headers : []
  },
}
</script>

<style scoped>

</style>