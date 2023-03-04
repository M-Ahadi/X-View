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
            <v-row
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
import {DatePicker} from "v-calendar";
import {mapActions} from "vuex";
import {INBOUND} from "@/store/constants";
import {GetHttpDefaultConfig} from "@/store/modules/protocol";

export default {
  name: "HttpForm",
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
    get_tls: function () {
      let headers = {}
      for (let i = 0; i++; i < this.inbound_vars.request_headers.length) {
        headers[this.inbound_vars.request_headers[i].header_name] = this.inbound_vars.request_headers[i].header_value
      }
      if (this.inbound_vars.tls) {
        return {
          "security": "tls",
          "tlsSettings": {
            "serverName": this.inbound_vars.serverName,
            "alpn": this.inbound_vars.alpn
          }
        }
      } else if (this.inbound_vars.xtls) {
        return {
          "security": "xtls",
          "xtlsSettings": {
            "serverName": this.inbound_vars.serverName,
            "alpn": this.inbound_vars.alpn
          }
        }
      } else {
        return {
          "security": "none",
        }
      }
    },
    tcp_config: function () {
      let header = {}
      if (this.inbound_vars.http_masquerade) {
        header = {
          "type": "http",
          "request": {
            "version": this.inbound_vars.request_version || '1.1',
            "method": this.inbound_vars.request_method || 'GET',
            "path": [
              this.inbound_vars.request_path || '/'
            ],
            "headers": {}
          },
          "response": {
            "version": this.inbound_vars.response_version || '1.1',
            "status": this.inbound_vars.response_status || '200',
            "reason": this.inbound_vars.response_status_description || 'OK',
            "headers": {}
          }
        }
      } else {
        header = {"type": "none"}
      }
      let config = {
        "network": "tcp",
        "tcpSettings": {
          "acceptProxyProtocol": this.inbound_vars.acceptProxyProtocol,
          "header": header
        }
      }
      return Object.assign(config, this.get_tls())
    },
    kcp_config: function () {

    },
    ws_config: function () {
      let config = {
        "network": this.inbound_vars.transmission,
        "wsSettings": {
          "acceptProxyProtocol": false,
          "path": this.inbound_vars.path,
          "headers": {}
        }
      }
      return Object.assign(config, this.get_tls())
    },
    http_config: function () {

    },
    quic_config: function () {

    },
    grpc_config: function () {

    },
    get_stream: function () {
      let stream_config = null
      switch (this.inbound_vars.transmission) {
        case 'tcp':
          stream_config = this.tcp_config()
          break
        case 'kcp':
          stream_config = this.kcp_config()
          break
        case 'ws':
          stream_config = this.ws_config()
          break
        case 'http':
          stream_config = this.http_config()
          break
        case 'quic':
          stream_config = this.quic_config()
          break
        case 'grpc':
          stream_config = this.grpc_config()
          break
          // default:
          //   stream_config = {
          //     "network": "tcp",
          //     "security": "none",
          //     "tcpSettings": {
          //       "acceptProxyProtocol": false,
          //       "header": {
          //         "type": "none"
          //       }
          //     }
          //   }
          //   break
      }
      return stream_config
    },
    async submit() {
      this.loading = true
      const NewConfig = new FormData();
      NewConfig.append("protocol", "http")
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
      settings = {
        "accounts": [
          {
            "user": this.inbound_vars.username,
            "pass": this.inbound_vars.password
          }
        ]
      }
      this.inbound_vars.transmission = "tcp"
      stream_settings = this.get_stream()
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
      this.inbound_vars = GetHttpDefaultConfig()
    }
  },
}
</script>

<style scoped>

</style>