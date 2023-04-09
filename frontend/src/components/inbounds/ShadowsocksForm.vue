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
            <v-select
                :label="$t('message.encryption')"
                v-model="inbound_vars.shadowsock_encryption"
                :rules="[rules.required]"
                :items="encryptions"
                solo
                density="compact"
                @update:modelValue="set_new_password"
            />
            <v-text-field
                :label="$t('message.password')"
                v-model="inbound_vars.shadowsocks_password"
                :rules="[rules.required]"
                density="compact"
                :value="inbound_vars.shadowsocks_password"
                :readonly="readonly"
            />
            <v-select
                :label="$t('message.network')"
                v-model="inbound_vars.network"
                :rules="[rules.required]"
                :items="networks"
                solo
                density="compact"
            />

            <v-select
                :label="$t('message.transmission')"
                v-model="inbound_vars.transmission"
                :rules="[rules.required]"
                :items="transmissions"
                @update:modelValue="updateTransmissionForm()"
                solo
                density="compact"
                :readonly="readonly"
            />
            <TcpSection
                v-if="inbound_vars.transmission === 'tcp'"
                :inbound="inbound_vars"
            />
            <WsSection
                v-if="inbound_vars.transmission === 'ws'"
                :inbound="inbound_vars"
            />
            <GrpcSection
                v-if="inbound_vars.transmission === 'grpc'"
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
import {CERTIFICATE, INBOUND, MASQUERADES, NETWORKS, SHADOWSOCKS_ENRYPTIONS, SHADOWSOCKS_TRANSMISSIONS} from "@/store/constants";
import {mapActions, mapGetters} from "vuex";
import {DatePicker} from 'v-calendar';
import {GetShadowsocksDefaultConfig} from "@/store/modules/protocol";
import {GetStream} from "@/store/modules/config_generators";
import TlsSection from "@/components/inbounds/sections/TlsSection";
import TcpSection from "@/components/inbounds/sections/TcpSection";
import WsSection from "@/components/inbounds/sections/WsSection";
import GrpcSection from "@/components/inbounds/sections/GrpcSection";
import {GeneratePassword} from "@/store/utils";

export default {
  name: "ShadowsocksForm",
  components: {
    GrpcSection,
    WsSection,
    TcpSection,
    TlsSection,
    DatePicker
  },
  props: {
    inbound: {required: false, default: null}
  },
  data() {
    return {
      inbound_vars: {},
      inbounds: [],
      masquerades: MASQUERADES,
      encryptions: SHADOWSOCKS_ENRYPTIONS,
      transmissions: SHADOWSOCKS_TRANSMISSIONS,
      networks: NETWORKS,
      certificates: [],
      valid: false,
      loading: false,
      readonly: false,
      rules: {
        required: value => !!value || this.$t('message.required'),
      },
      Enabled: {},
    }
  },
  methods: {
    ...mapActions("inbounds", {
      UpdateInbound: INBOUND.UPDATE_INBOUND,
      AddInbound: INBOUND.ADD_INBOUND,
      GenPassoword: INBOUND.GET_PASSWORD
    }),
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
    }),
    async set_new_password (){
      switch (this.inbound_vars.shadowsock_encryption){
        case "2022-blake3-aes-128-gcm":
          await this.GenPassoword(16)
          this.inbound_vars.shadowsocks_password = this.getPassword
          this.readonly = true
          this.inbound_vars.transmission = this.transmissions[0]
          break
        case "2022-blake3-aes-256-gcm":
          await this.GenPassoword(32)
          this.inbound_vars.shadowsocks_password = this.getPassword
          this.readonly = true
          this.inbound_vars.transmission = this.transmissions[0]
          break
        case "2022-blake3-chacha20-poly1305":
          await this.GenPassoword(32)
          this.inbound_vars.shadowsocks_password = this.getPassword
          this.readonly = true
          this.inbound_vars.transmission = this.transmissions[0]
          break
        default:
          this.inbound_vars.shadowsocks_password = GeneratePassword()
          this.readonly = false
          this.inbound_vars.transmission = this.transmissions[0]
      }
    },
    updateTransmissionForm: function () {
      this.inbound_vars.masquerade = this.masquerades[0]
      this.inbound_vars.tls = false
      this.inbound_vars.xtls = false
    },
    async submit() {
      this.loading = true
      const NewConfig = new FormData();
      NewConfig.append("protocol", "shadowsocks")
      NewConfig.append("name", this.inbound_vars.name)
      NewConfig.append("bindip", this.inbound_vars.bindip)
      NewConfig.append("port", this.inbound_vars.port)
      NewConfig.append("behind_nginx", this.inbound_vars.behind_nginx || false)
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
        "method": this.inbound_vars.shadowsock_encryption,
        "password": this.inbound_vars.shadowsocks_password,
        "network": this.inbound_vars.network,
        "email": this.inbound_vars.port + "@xview.local",
        "level": 0
      }

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
  computed: {
    ...mapGetters('certificate',
        {
          getCertificateList: 'getCertificateList',
        }),
    ...mapGetters('inbounds',
        {
          getPassword: 'getPassword',
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
      this.inbound_vars = GetShadowsocksDefaultConfig()
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