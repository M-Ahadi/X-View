<template>
          <v-form
              @submit.prevent="submit"
          >
            <v-text-field
                :label="$t('message.name')"
                v-model="inbound_vars.name"
                solo
                density="compact"
            />
            <v-row>
              <v-col>
                <v-text-field
                    :label="$t('message.listening_ip')"
                    placeholder="0.0.0.0"
                    :rules="[rules.required]"
                    v-model="inbound_vars.bindip"
                    solo
                    density="compact"
                />
              </v-col>
              <v-col>
                <v-text-field
                    :label="$t('message.listening_port')"
                    :rules="[rules.required]"
                    v-model="inbound_vars.port"
                    solo
                    density="compact"
                    type="number"
                />
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
                />
              </v-col>
              <v-col>
                <v-select
                    :label="$t('message.flow')"
                    v-model="inbound_vars.flow"
                    :rules="[rules.required]"
                    :items="flows"
                    item-title="name"
                    item-value="id"
                    solo
                    density="compact"
                />
              </v-col>
            </v-row>
            <v-select
                :label="$t('message.transmission')"
                v-model="inbound_vars.transmission"
                :rules="[rules.required]"
                :items="transmissions"
                @update:modelValue="updateTransmissionForm()"
                solo
                density="compact"
            />
            <TcpSection
                v-if="inbound_vars.transmission === 'tcp'"
                :inbound="inbound_vars"
            />
            <KcpSection
                v-if="inbound_vars.transmission === 'kcp'"
                :inbound="inbound_vars"
            />
            <WsSection
                v-if="inbound_vars.transmission === 'ws'"
                :inbound="inbound_vars"
            />
            <HttpSection
                v-if="inbound_vars.transmission === 'http'"
                :inbound="inbound_vars"
            />
            <QuicSection
                v-if="inbound_vars.transmission === 'quic'"
                :inbound="inbound_vars"
            />
            <GrpcSection
                v-if="inbound_vars.transmission === 'grpc'"
                :inbound="inbound_vars"
            />
            <HttpMasqueradeSection
                v-if="inbound_vars.http_masquerade"
                :inbound="inbound_vars"
            />
            <TlsSection
                :inbound="inbound_vars"
                v-if="inbound_vars.tls || inbound_vars.xtls"
            />

            <v-checkbox-btn
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
import {CERTIFICATE, FLOWS, INBOUND, MASQUERADES, TRANSMISSIONS} from "@/store/constants";
import {mapActions, mapGetters} from "vuex";
import { GetTrojanDefaultConfig} from "@/store/modules/protocol";
import {DatePicker} from 'v-calendar';
import {GetStream} from "@/store/modules/config_generators";
import TcpSection from "@/components/inbounds/sections/TcpSection";
import WsSection from "@/components/inbounds/sections/WsSection";
import HttpSection from "@/components/inbounds/sections/HttpSection";
import GrpcSection from "@/components/inbounds/sections/GrpcSection";
import HttpMasqueradeSection from "@/components/inbounds/sections/HttpMasqueradeSection";
import KcpSection from "@/components/inbounds/sections/KcpSection";
import QuicSection from "@/components/inbounds/sections/QuicSection";
import TlsSection from "@/components/inbounds/sections/TlsSection";

export default {
  name: "TrojanForm",
  components: {
    TlsSection,
    QuicSection,
    KcpSection,
    HttpMasqueradeSection,
    GrpcSection,
    HttpSection,
    WsSection,
    TcpSection,
    DatePicker
  },
  props: {
    inbound: {required: false, default: null}
  },
  data() {
    return {
      inbound_vars: {},
      certificates: [],
      masquerades: MASQUERADES,
      transmissions: TRANSMISSIONS,
      flows: FLOWS,
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
    updateTransmissionForm: function () {
      this.inbound_vars.masquerade = this.masquerades[0]
      this.inbound_vars.tls = false
      this.inbound_vars.xtls = false
      this.inbound_vars.request_headers = this.inbound_vars.request_headers ? this.inbound_vars.request_headers : []
    },
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
            "flow": this.inbound_vars.flow,
            "email": this.inbound_vars.port +"@xview.local",
            "level": 0,
          }
        ],
        "fallbacks": []
      }
      stream_settings = GetStream(this.inbound_vars)
      // stream_settings = Object.assign(stream_settings, {
      //   "tcpSettings": {
      //     "acceptProxyProtocol": this.inbound_vars.acceptProxyProtocol,
      //     "header": {
      //       "type": "none"
      //     }
      //   }
      // })
      NewConfig.append("protocol_setting", JSON.stringify(settings))
      NewConfig.append("transport", JSON.stringify(stream_settings))
      if (this.inbound_vars.update) {
        await this.UpdateInbound({id: this.inbound_vars.id, data: NewConfig})
      } else {
        await this.AddInbound(NewConfig)
      }

      this.loading = false
      // this.$emit("CloseForm")
      // this.$router.go({name: 'inbound'})
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
      this.inbound_vars.flow = this.inbound_vars.protocol_setting.clients[0].flow
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