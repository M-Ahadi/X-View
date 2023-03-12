<template>
  <v-row>
    <v-col>
      <v-select
          :label="$t('message.encryption')"
          v-model="inbound_vars.encryption"
          :rules="[rules.required]"
          :items="encryptions"
          solo
          density="compact"
      />
    </v-col>
    <v-col>
      <v-text-field
          :label="$t('message.password')"
          :rules="[rules.required]"
          v-model="inbound_vars.password"
          density="compact"
          :value="inbound_vars.password"
      />
    </v-col>
  </v-row>
  <v-select
      :label="$t('message.masquerade')"
      v-model="inbound_vars.masquerade"
      :rules="[rules.required]"
      :items="masquerades"
      solo
      density="compact"
      item-title="name"
      item-value="value"
      return-object
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

import {QUIC_ENCRYPTIONS, MASQUERADES} from "@/store/constants";
import {GeneratePassword} from "@/store/utils";

export default {
  name: "QuicSection",
  props: {
    inbound: {required: true}
  },
  data() {
    return {
      inbound_vars: {},
      masquerades: MASQUERADES,
      encryptions: QUIC_ENCRYPTIONS,
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
    }
  },
  mounted() {
    this.inbound_vars = this.inbound
    this.inbound_vars.encryption = this.inbound_vars.encryption ? this.inbound_vars.encryption : this.encryptions[0]
    if (! this.inbound_vars.password){
      this.inbound_vars.password = GeneratePassword()
    }
  },
}
</script>

<style scoped>

</style>