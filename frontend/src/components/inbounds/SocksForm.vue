<template>
  <v-form
      @submit.prevent="submit"
  >
    <v-text-field
        :label="$t('message.name')"
        v-model="inbound_vars.name"
        solo
        density="compact"
    ></v-text-field>
    <v-row>
      <v-col>
        <v-text-field
            :label="$t('message.listening_ip')"
            placeholder="0.0.0.0"
            :rules="[rules.required]"
            v-model="inbound_vars.bindip"
            solo
            density="compact"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            :label="$t('message.listening_port')"
            :rules="[rules.required]"
            v-model="inbound_vars.port"
            solo
            density="compact"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DatePicker v-model="inbound_vars.expire" :masks="{input: 'YYYY/MM/DD'}">
          <template v-slot="{ inputValue, inputEvents }">
            <v-text-field
                variant="outlined"
                :model-value="inputValue"
                v-on="inputEvents"
                density="compact"
                prepend-inner-icon="mdi-calendar-month"
            />
          </template>
        </DatePicker>
      </v-col>
      <v-col>
        <v-text-field
            :label="$t('message.total_data_traffic')"
            v-model="inbound_vars.total"
            solo
            density="compact"

        />
      </v-col>
    </v-row>
    <v-checkbox
        v-model="inbound_vars.password_authentication"
        color="primary"
        hide-details
        :label="$t('message.password_authentication')"
        density="compact"
    />
    <v-row
        v-if="inbound_vars.password_authentication"
    >
      <v-col>
        <v-text-field
            v-model="inbound_vars.username"
            :label="$t('message.username')"
            density="compact"
        />
      </v-col>
      <v-col>
        <v-text-field
            v-model="inbound_vars.password"
            :label="$t('message.password')"
            density="compact"
        />
      </v-col>
    </v-row>
    <v-checkbox
        v-model="inbound_vars.enable_udp"
        color="primary"
        hide-details
        :label="$t('message.enable_udp')"
        density="compact"
    />
    <v-row
        v-if="inbound_vars.enable_udp"
    >
      <v-col>
        <v-text-field
            v-model="inbound_vars.socks_ip"
            :label="$t('message.ip')"
            density="compact"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
            v-if="inbound_vars.update"
            type="submit"
            x-large
            block
            outlined
            color="indigo"
            :loading="loading"
        >{{ $t('message.update') }}
        </v-btn>
        <v-btn
            v-else
            type="submit"
            x-large
            block
            outlined
            color="indigo"
            :loading="loading"
        >{{ $t('message.add') }}
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
            x-large
            block
            outlined
            color="gray"
            @click='$emit("CloseForm")'
        >{{ $t('message.cancel') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import {INBOUND} from "@/store/constants";
import {mapActions} from "vuex";
import {DatePicker} from 'v-calendar';
import {GetSocksDefaultConfig} from "@/store/modules/protocol";
import {GetStream} from "@/store/modules/config_generators";

export default {
  name: "SocksForm",
  components: {
    DatePicker
  },
  props: {
    inbound: {required: false, default: null}
  },
  data() {
    return {
      inbound_vars: {},
      valid: false,
      loading: false,
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
    }
  },
  methods: {
    ...mapActions("inbounds", {
      UpdateInbound: INBOUND.UPDATE_INBOUND,
      AddInbound: INBOUND.ADD_INBOUND
    }),
    async submit() {
      this.loading = true
      const NewConfig = new FormData();
      NewConfig.append("protocol", "socks")
      NewConfig.append("name", this.inbound_vars.name)
      NewConfig.append("bindip", this.inbound_vars.bindip)
      NewConfig.append("port", this.inbound_vars.port)
      if (this.inbound_vars.certificate) {
        NewConfig.append("certificate", this.inbound_vars.certificate)
      }

      if (!this.inbound_vars.expire) {
        NewConfig.append("expire", "")
      } else {
        NewConfig.append("expire", Math.round(Date.parse(this.inbound_vars.expire) / 1000 / 86400) * 86400)
      }
      NewConfig.append("enable", true)

      NewConfig.append("sniffing", false)
      let settings = {}
      let stream_settings = {}
      if (this.inbound_vars.password_authentication) {
        settings = {
          "auth": "password",
          "accounts": [
            {
              "user": this.inbound_vars.username,
              "pass": this.inbound_vars.password
            }
          ],
          "udp": this.inbound_vars.enable_udp,
          "ip": this.inbound_vars.socks_ip || "127.0.0.1"
        }
      } else {
        settings = {
          "auth": "noauth",
          "udp": this.inbound_vars.enable_udp,
          "ip": this.inbound_vars.socks_ip || "127.0.0.1"
        }
      }
      this.inbound_vars.transmission = "tcp"
      stream_settings = GetStream(this.inbound_vars)
      NewConfig.append("protocol_setting", JSON.stringify(settings))
      NewConfig.append("transport", JSON.stringify(stream_settings))
      if (this.inbound_vars.update) {
        await this.UpdateInbound({id: this.inbound_vars.id, data: NewConfig})
      } else {
        await this.AddInbound(NewConfig)
      }

      this.loading = false
      this.$emit("CloseForm")
      this.$router.go({name: 'inbound'})
    },
  },

  async mounted() {
    if (this.inbound) {
      this.inbound_vars = JSON.parse(JSON.stringify(this.inbound))
      this.inbound_vars.protocol_setting = JSON.parse(this.inbound_vars.protocol_setting)
      this.inbound_vars.transport = JSON.parse(this.inbound_vars.transport)
      if (this.inbound_vars.expire) {
        this.inbound_vars.expire = new Date(this.inbound_vars.expire * 1000)
      }
    } else {
      this.inbound_vars = GetSocksDefaultConfig()
    }
  },
}
</script>

<style scoped>

</style>