<template>
  <v-row>
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
      <v-text-field
          :label="$t('message.mtu')"
          :rules="[rules.required]"
          v-model="inbound_vars.mtu"
          :model-value="inbound_vars.mtu || 1350"
          density="compact"
      />
    </v-col>
    <v-col>
      <v-text-field
          :label="$t('message.tti')"
          :rules="[rules.required]"
          v-model="inbound_vars.tti"
          :model-value="inbound_vars.tti || 20"
          density="compact"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-text-field
          :label="$t('message.uplink_capacity')"
          :rules="[rules.required]"
          v-model="inbound_vars.uplikCapacity"
          :model-value="inbound_vars.uplikCapacity || 5"
          density="compact"
      />
    </v-col>
    <v-col>
      <v-text-field
          :label="$t('message.downlink_capacity')"
          :rules="[rules.required]"
          v-model="inbound_vars.downlinkCapacity"
          :model-value="inbound_vars.downlinkCapacity || 20"
          density="compact"
      />
    </v-col>
  </v-row>
  <v-checkbox-btn
      v-model="inbound_vars.congestion"
      color="primary"
      hide-details
      :label="$t('message.congestion')"
      density="compact"
  />
  <v-row>
    <v-col>
      <v-text-field
          :label="$t('message.read_buffer_size')"
          :rules="[rules.required]"
          v-model="inbound_vars.readBufferSize"
          :model-value="inbound_vars.readBufferSize || 2"
          density="compact"
      />
    </v-col>
    <v-col>
      <v-text-field
          :label="$t('message.write_buffer_size')"
          :rules="[rules.required]"
          v-model="inbound_vars.writeBufferSize"
          :model-value="inbound_vars.writeBufferSize || 2"
          density="compact"
      />
    </v-col>
  </v-row>
</template>

<script>
import {MASQUERADES} from "@/store/constants";
import {GeneratePassword} from "@/store/utils";

export default {
  name: "KcpSection",
  props: {
    inbound: {required: true}
  },
  data() {
    return {
      inbound_vars: '',
      masquerades: MASQUERADES,
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
    }
  },
  mounted() {
    this.inbound_vars = this.inbound
    if (! this.inbound_vars.password){
      this.inbound_vars.password = GeneratePassword()
    }
  },
}
</script>

<style scoped>

</style>