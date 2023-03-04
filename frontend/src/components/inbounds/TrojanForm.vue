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
            <v-row>
              <v-col>
                <v-text-field
                    :label="$t('message.password')"
                    :rules="[rules.required]"
                    v-model="inbound_vars.password"
                    density="compact"
                    :value="inbound_vars.password"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                    v-model="inbound_vars.acceptProxyProtocol"
                    color="primary"
                    hide-details
                    :label="$t('message.accept_proxy_protocol')"
                    density="compact"
                >
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                    v-model="inbound_vars.tls"
                    color="primary"
                    hide-details
                    label="TLS"
                    density="compact"
                >
                </v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
                    v-model="inbound_vars.xtls"
                    color="primary"
                    hide-details
                    label="XTLS"
                    density="compact"
                >
                </v-checkbox>
              </v-col>
            </v-row>
            <section
                v-if="inbound_vars.tls || inbound_vars.xtls"
            >
              <v-text-field
                  v-model="inbound_vars.serverName"
                  :label="$t('message.domain_name')"
                  density="compact"
              >
              </v-text-field>
              <v-text-field
                  v-model="inbound_vars.alpn"
                  label="ALPN"
                  density="compact"
              >
              </v-text-field>
              <v-select
                  :label="$t('message.certificate')"
                  v-model="inbound_vars.certificate"
                  :rules="[rules.required]"
                  :items="certificates"
                  item-title="name"
                  item-value="id"
                  solo
                  density="compact"
              >
              </v-select>
            </section>
            <v-checkbox
                v-model="inbound_vars.sniffing"
                color="primary"
                hide-details
                :label="$t('message.sniffing')"
                density="compact"
            />
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
import {CERTIFICATE, INBOUND} from "@/store/constants";
import {mapActions, mapGetters} from "vuex";
import { GetTrojanDefaultConfig} from "@/store/modules/protocol";
import {DatePicker} from 'v-calendar';
import {GetStream} from "@/store/modules/config_generators";

export default {
  name: "TrojanForm",
  components: {
    DatePicker
  },
  props: {
    inbound: {required: false, default: null}
  },
  data() {
    return {
      inbound_vars: {},
      certificates: [],
      valid: false,
      loading: false,
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
      Enabled: {},
    }
  },
  methods: {
    ...mapActions("inbounds", {
      UpdateInbound: INBOUND.UPDATE_INBOUND,
      AddInbound: INBOUND.ADD_INBOUND
    }),
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
    }),
    async submit() {
      this.loading = true
      const NewConfig = new FormData();
      NewConfig.append("protocol", "trojan")
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

      NewConfig.append("sniffing", this.inbound_vars.sniffing)
      let settings = {}
      let stream_settings = {}
      settings = {
        "clients": [
          {
            "password": this.inbound_vars.password,
            "flow": "xtls-rprx-direct"
          }
        ],
        "fallbacks": []
      }
      this.inbound_vars.transmission = 'tcp'
      stream_settings = GetStream(this.inbound_vars)
      stream_settings = Object.assign(stream_settings, {
        "tcpSettings": {
          "acceptProxyProtocol": this.inbound_vars.acceptProxyProtocol,
          "header": {
            "type": "none"
          }
        }
      })
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
  computed: {
    ...mapGetters('certificate',
        {
          getCertificateList: 'getCertificateList',
        }),
  },
  async mounted() {
    await this.listCertificate()
    this.certificates = this.getCertificateList
    if(this.inbound){
      this.inbound_vars = JSON.parse(JSON.stringify(this.inbound))
      this.inbound_vars.protocol_setting = JSON.parse(this.inbound_vars.protocol_setting)
      this.inbound_vars.transport = JSON.parse(this.inbound_vars.transport)
      if(this.inbound_vars.expire){
        this.inbound_vars.expire = new Date(this.inbound_vars.expire * 1000)
      }
    }else {
      this.inbound_vars = GetTrojanDefaultConfig()
    }
  },
  watch: {
    "inbound_vars.xtls": function (new_value) {
      if (new_value) {
        this.inbound_vars.tls = false
      }
    },
    "inbound_vars.tls": function (new_value) {
      if (new_value) {
        this.inbound_vars.xtls = false
      }
    },
  },
}
</script>

<style scoped>

</style>