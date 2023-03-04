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
            <v-text-field
                :label="$t('message.id')"
                :rules="[rules.required]"
                v-model="inbound_vars.uid"
                density="compact"
            >
            </v-text-field>
            <v-row>
              <v-col>
                <v-checkbox
                    v-model="inbound_vars.disableInsecureEncryption"
                    color="primary"
                    hide-details
                    :label="$t('message.disable_insecure_encryption')"
                    density="compact"
                >
                </v-checkbox>
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
            ></v-select>
            <v-row>
              <v-col
                  v-if="['quic'].find(member=>member===inbound_vars.transmission)">
                <v-select
                    :label="$t('message.encryption')"
                    v-model="inbound_vars.encryption"
                    :rules="[rules.required]"
                    :items="encryptions"
                    solo
                    density="compact"
                ></v-select>
              </v-col>
              <v-col
                  v-if="['kcp','quic'].find(member=>member===inbound_vars.transmission)">
                <v-text-field
                    :label="$t('message.password')"
                    :rules="[rules.required]"
                    v-model="inbound_vars.password"
                    density="compact"
                    :value="inbound_vars.password"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-select
                v-if="['quic','kcp'].find(member=>member===inbound_vars.transmission)"
                :label="$t('message.masquerade')"
                v-model="inbound_vars.masquerade"
                :rules="[rules.required]"
                :items="masquerades"
                solo
                density="compact"
                item-title="name"
                item-value="value"
                return-object
            >
            </v-select>
              <section
                  v-if="['kcp'].find(member=>member===inbound_vars.transmission)"
              >
                <v-row
                >
                  <v-col>
                    <v-text-field
                        :label="$t('message.mtu')"
                        :rules="[rules.required]"
                        v-model="inbound_vars.mtu"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                        :label="$t('message.tti')"
                        :rules="[rules.required]"
                        v-model="inbound_vars.tti"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row
                >
                  <v-col>
                    <v-text-field
                        :label="$t('message.uplink_capacity')"
                        :rules="[rules.required]"
                        v-model="inbound_vars.uplink_capacity"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                        class="py-0 my-0"
                        :label="$t('message.downlink_capacity')"
                        :rules="[rules.required]"
                        v-model="inbound_vars.downlink_capacity"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-checkbox
                    v-model="inbound_vars.congestion"
                    color="primary"
                    hide-details
                    :label="$t('message.congestion')"
                    density="compact"
                >
                </v-checkbox>
                <v-row>
                  <v-col>
                    <v-text-field
                        :label="$t('message.read_buffer_size')"
                        :rules="[rules.required]"
                        v-model="inbound_vars.read_buffer_size"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                        :label="$t('message.write_buffer_size')"
                        :rules="[rules.required]"
                        v-model="inbound_vars.write_buffer_size"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </section>
              <section
                  v-if="inbound_vars.transmission === 'ws'"
              >
                <v-text-field
                    v-model="inbound_vars.path"
                    :label="$t('message.path')"
                    density="compact"
                ></v-text-field>
                <v-row>
                  <v-col>
                    {{ $t('message.add_header') }}
                    <v-btn
                        variant="outlined"
                        size="small"
                        @click="createNewHeader()"
                    >
                      <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row
                    v-for="item in inbound_vars.request_headers"
                    :key="item.id"
                    density="compact"
                >
                  <v-col
                      cols="5"
                  >
                    <v-text-field
                        v-model="item.inbound_vars.header_name"
                        :label="$t('message.name')"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols="5"
                  >
                    <v-text-field
                        v-model="item.header_value"
                        :label="$t('message.value')"
                        density="compact"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols="2"
                      density="compact"
                  >
                    <v-btn
                        variant="outlined"
                        size="small"
                        @click="removeHeader(item.id)"
                    >
                      <v-icon>mdi-minus-box</v-icon>

                    </v-btn>
                  </v-col>
                </v-row>
              </section>
            <section
                v-if="inbound_vars.transmission === 'http'"
            >
              <v-text-field
                  v-model="inbound_vars.path"
                  :label="$t('message.path')"
                  density="compact"
              ></v-text-field>
              <v-text-field
                  v-model="inbound_vars.host"
                  :label="$t('message.host')"
                  density="compact"
              ></v-text-field>
            </section>

            <v-text-field
                v-if="inbound_vars.transmission === 'grpc'"
                :label="$t('message.service_name')"
                :rules="[rules.required]"
                v-model="inbound_vars.service_name"
                density="compact"
            ></v-text-field>

            <v-row>
              <v-col>
                <v-checkbox
                    v-if="['tcp','ws'].find(member=>member===inbound_vars.transmission)"
                    v-model="inbound_vars.acceptProxyProtocol"
                    color="primary"
                    hide-details
                    :label="$t('message.accept_proxy_protocol')"
                    density="compact"
                >
                </v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
                    v-model="inbound_vars.http_masquerade"
                    color="primary"
                    hide-details
                    :label="$t('message.http_masquerade')"
                    density="compact"
                >
                </v-checkbox>
              </v-col>
            </v-row>
            <section
                v-if="inbound_vars.http_masquerade"
            >
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

            </section>
            <v-row>
              <v-col>
                <v-checkbox
                    v-if="['tcp','ws','http', 'grpc','quic'].find(member=>member===inbound_vars.transmission)"
                    v-model="inbound_vars.tls"
                    color="primary"
                    hide-details
                    label="TLS"
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
import {CERTIFICATE, ENCRYPTIONS, INBOUND, MASQUERADES, NETWORKS, PROTOCOLS, TRANSMISSIONS} from "@/store/constants";
import {mapActions, mapGetters} from "vuex";
import {GetVmessDefaultConfig} from "@/store/modules/protocol";
import {DatePicker} from 'v-calendar';
import {CreateNewHeader, GetStream, RemoveHeader} from "@/store/modules/config_generators";

export default {
  name: "VmessForm",
  components: {
    DatePicker
  },
  props: {
    inbound: {required: false, default: null}
  },
  data() {
    return {
      protocols: PROTOCOLS,
      masquerades: MASQUERADES,
      encryptions: ENCRYPTIONS,
      transmissions: TRANSMISSIONS,
      inbound_vars: {},
      networks: NETWORKS,
      certificates: [],
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
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
    }),
    updateTransmissionForm: function () {
      this.inbound_vars.masquerade = this.masquerades[0]
    },
    createNewHeader: function () {
      this.inbound_vars = CreateNewHeader(this.inbound_vars)
    },
    removeHeader: function (header_id) {
      this.inbound_vars = RemoveHeader(header_id, this.inbound_vars)
    },
    async submit() {
      this.loading = true
      const NewConfig = new FormData();
      NewConfig.append("protocol", "vmess")
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
            "id": this.inbound_vars.uid,
            "email": this.inbound_vars.uid + "@xview.local",
            "alterId": 0
          }
        ],
        "disableInsecureEncryption": this.inbound_vars.disableInsecureEncryption
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
      this.inbound_vars = GetVmessDefaultConfig()
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