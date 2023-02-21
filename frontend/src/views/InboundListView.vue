<template>
  <v-container>
    <v-row justify="space-between" class="text-start">
      <v-col>
        <v-btn
            icon="mdi-plus"
            color="primary"
            variant="flat"
            @click="showDialog()"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-table
            fixed-header
            class="elevation-1 rounded-xl"
        >
          <thead>
          <tr>
            <th class="bg-grey-lighten-3">{{ $t('message.operation') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.enable') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.name') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.protocol') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.port') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.traffic') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.details') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.transport_configuration') }}</th>
            <th class="bg-grey-lighten-3">{{ $t('message.expire') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in inbounds"
              :key="item.id"
              class="text-left"
          >
            <td>
              <v-menu
                  location="end"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                      v-bind="props"
                      flat
                      icon="mdi-playlist-edit"
                      color="primary"
                      variant="flat"
                      size="small"
                  >
                  </v-btn>
                </template>
                <v-list
                    class="px-3"
                    density="compact"
                >
                  <v-list-item
                      v-if="['vmess','vless','shadowsocks', 'trojan'].find(member=>member===item.protocol)"
                      link
                      @click="show_qrcode(item.id)"
                      :title="$t('message.qrcode')"
                      density="compact"
                  ></v-list-item>
                  <v-list-item
                      @click="change_inbound(item.id)"
                      :title="$t('message.edit')"
                      density="compact"
                  ></v-list-item>
                  <v-list-item
                      link
                      @click="ask_delete_inbound(item.id)"
                      :title="$t('message.delete')"
                      density="compact"
                  ></v-list-item>
                </v-list>
              </v-menu>


            </td>
            <td>
              <v-switch

                  :model-value="item.enable"
                  @change="status_changed(item.id)"
                  color="primary"
                  hide-details
                  density="compact"
              >
              </v-switch>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.protocol }}</td>
            <td>{{ formatNumber(item.port) }}</td>
            <td>{{ formatNumber(item.up, 2) }} /
              {{ formatNumber(item.down, 2) }}
            </td>
            <td>{{ item.details }}</td>
            <td>Check</td>
            <td v-if="item.expire">{{ formatDate(item.expire) }}</td>
            <td v-else>unlimited</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog
      v-model="qrcode_dialog"
  >
    <QrcodePage :text="config_string"
                error-level="L"
    >
    </QrcodePage>
  </v-dialog>
  <v-dialog
      v-model="inbound_form_dialog"
      width="500"
  >
    <v-card
        elevation="0"
        class=" my-10  pb-5"
        max-width="600px"
    >
      <v-card-title class="headline" justify>
        {{ $t('message.add_inbound') }}
      </v-card-title>
      <v-container>
        <v-form
            @submit.prevent="submit"
        >
          <v-text-field
              :label="$t('message.name')"
              v-model="inbound_vars.name"
              solo
              density="compact"
          ></v-text-field>
          <v-select
              :label="$t('message.protocol')"
              v-model="inbound_vars.protocol"
              :rules="[rules.required]"
              :items="protocols"
              @chage="updateForm()"
              solo
              density="compact"
              @update:modelValue="updateProtocolForm()"
          ></v-select>
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
              v-if="['vmess','vless'].find(member=>member===inbound_vars.protocol)"
              density="compact"
          >
          </v-text-field>
          <v-row
              v-if="inbound_vars.protocol === 'vmess'"
          >
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
          <v-row
              v-if="['shadowsocks'].find(member=>member===inbound_vars.protocol)"
          >
            <v-col>
              <v-select
                  :label="$t('message.encryption')"
                  v-model="inbound_vars.shadowsocks_encryption"
                  :rules="[rules.required]"
                  :items="shadowsocks_encryptions"
                  solo
                  density="compact"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                  :label="$t('message.password')"
                  v-model="inbound_vars.shadowsocks_password"
                  :rules="[rules.required]"
                  density="compact"
                  :value="inbound_vars.shadowsocks_password"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
              v-if="['dokodemo-door'].find(member=>member===inbound_vars.protocol)"
          >
            <v-col>
              <v-text-field
                  :label="$t('message.destination_address')"
                  v-model="inbound_vars.destination_address"
                  :rules="[rules.required]"
                  density="compact"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  :label="$t('message.destination_port')"
                  v-model="inbound_vars.destination_port"
                  :rules="[rules.required]"
                  density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-select
              v-if="['shadowsocks','dokodemo-door'].find(member=>member===inbound_vars.protocol)"
              :label="$t('message.network')"
              v-model="inbound_vars.network"
              :rules="[rules.required]"
              :items="networks"
              solo
              density="compact"
          ></v-select>

          <v-select
              v-if="['vmess','vless','shadowsocks'].find(member=>member===inbound_vars.protocol)"
              :label="$t('message.transmission')"
              v-model="inbound_vars.transmission"
              :rules="[rules.required]"
              :items="transmissions"
              @update:modelValue="updateTransmissionForm()"
              solo
              density="compact"
          ></v-select>
          <v-row
              v-if="['vless','vmess','shadowsocks','trojan'].find(member=>member===inbound_vars.protocol)"
          >
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
                v-if="['kcp','quic'].find(member=>member===inbound_vars.transmission) || ['trojan'].find(member=>member===inbound_vars.protocol)">
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
              v-if="['quic','kcp'].find(member=>member===inbound_vars.transmission) && ['vless','vmess','shadowsocks'].find(member=>member===inbound_vars.protocol)"
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
              v-if="['vmess','vless','shadowsocks'].find(member=>member===inbound_vars.protocol)"
          >
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
              v-if="inbound_vars.transmission === 'grpc' && ['vmess','vless', 'shadowsocks'].find(member=>member===inbound_vars.protocol)"
              :label="$t('message.service_name')"
              :rules="[rules.required]"
              v-model="inbound_vars.service_name"
              density="compact"
          ></v-text-field>

          <v-row
              v-if="['trojan','vmess','vless','shadowsocks'].find(member=>member===inbound_vars.protocol)"
          >
            <v-col>
              <v-checkbox
                  v-if="['tcp','ws'].find(member=>member===inbound_vars.transmission) || ['trojan'].find(member=>member===inbound_vars.protocol)"
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
                  v-if="['tcp'].find(member=>member===inbound_vars.transmission) && ['vmess','vless','shadowsocks'].find(member=>member===inbound_vars.protocol)"
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
          <v-row
              v-if="['vless','vmess','shadowsocks', 'trojan'].find(member=>member===inbound_vars.protocol)"
          >
            <v-col>
              <v-checkbox
                  v-if="['tcp','ws','http', 'grpc','quic'].find(member=>member===inbound_vars.transmission) || ['trojan','vless','shadowsocks'].find(member=>member===inbound_vars.protocol)"
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
                  v-if="(inbound_vars.protocol==='vless' && inbound_vars.transmission ==='tcp')|| inbound_vars.protocol==='trojan'"
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
              v-if="inbound_vars.protocol==='socks'"
              v-model="inbound_vars.password_authentication"
              color="primary"
              hide-details
              :label="$t('message.password_authentication')"
              density="compact"
          />
          <section
              v-if="inbound_vars.password_authentication || inbound_vars.protocol === 'http'"
          >
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
          </section>
          <v-checkbox
              v-if="inbound_vars.protocol==='socks'"
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
          <v-checkbox
              v-if="['vmess','vless','shadowsocks', 'trojan'].find(member=>member===inbound_vars.protocol)"
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
                  @click="inbound_form_dialog = false"
              >{{ $t('message.cancel') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
  <v-dialog
      v-model="delete_inbound_dialog"
      max-width="400px"
  >
    <v-card
        elevation="0"
        class=" my-10  pb-5"
        max-width="600px"
        rounded
    >
      <v-card-title class="headline" justify>
        {{ $t('message.delete_inbound') }}
      </v-card-title>
      <v-card-text>
        {{ $t('message.make_sure') }}
      </v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-btn
                block
                color="red"
                :loading="loading"
                elevation="3"
                @click="delete_inbound"

            >{{ $t('message.yes') }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
                block
                color="secondary"
                :loading="loading"
                elevation="3"
                @click="delete_inbound_dialog= !delete_inbound_dialog"
            >{{ $t('message.cancel') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import QrcodePage from "@/components/QrcodePage";
import 'v-calendar/dist/style.css';
import {DatePicker} from 'v-calendar';
import {mapActions, mapGetters} from "vuex";
import {ENCRYPTIONS, INBOUND, MASQUERADES, NETWORKS, PROTOCOLS, SHADOWSOCKS_ENRYPTIONS} from "@/store/constants";
import {CERTIFICATE,TRANSMISSIONS} from "@/store/constants";
import {GetDefaultConfig, JsonToConfig} from '@/store/modules/protocol'
import {uuidv4} from "@/store/utils";
import {MakeConfigString} from "@/store/modules/qrcode";

export default {
  name: "InboundListView",
  components: {
    QrcodePage,
    DatePicker
  },
  data() {
    return {
      config_string: '',
      inbound_vars: {},
      inbounds: [],
      protocols: PROTOCOLS,
      masquerades: MASQUERADES,
      encryptions: ENCRYPTIONS,
      shadowsocks_encryptions: SHADOWSOCKS_ENRYPTIONS,
      qrcode_dialog: false,
      inbound_form_dialog: false,
      transmissions: TRANSMISSIONS,
      networks: NETWORKS,
      certificates: [],
      delete_inbound_dialog: false,
      inbound_id_to_delete: null,
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
      ListInbounds: INBOUND.LIST_INBOUNDS,
      GetInbound: INBOUND.GET_INBOUND,
      DeleteInbound: INBOUND.DELETE_INBOUND,
      UpdateInbound: INBOUND.UPDATE_INBOUND,
      UpdateStatus: INBOUND.UPDATE_STATUS,
      AddInbound: INBOUND.ADD_INBOUND
    }),
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
    }),
    get_local() {
      return this.$i18n.getLocaleMessage(localStorage.default_language).local
    },
    formatNumber(number, digits = 0) {
      return Number(number).toLocaleString(this.get_local(), {maximumFractionDigits: digits, signDisplay: "never"})
    },
    formatDate(date) {
      const new_data = new Date(date * 1000)
      return new_data.toLocaleDateString(this.get_local())
    },
    find_inbound(inbound_id) {
      if (inbound_id) {
        for (let i = 0; i < this.inbounds.length; i++) {
          if (this.inbounds[i].id === inbound_id) {
            return this.inbounds[i]
          }
        }
      }
    },
    async status_changed(inbound_id) {
      let NewStatus = new FormData()
      const inbound = this.find_inbound(inbound_id)
      NewStatus.append("enable", !inbound.enable)
      await this.UpdateStatus({id: inbound.id, data: NewStatus})
    },
    change_inbound(inbound_id) {
      this.showDialog(inbound_id)
    },
    ask_delete_inbound(inbound_id) {
      this.delete_inbound_dialog = true
      this.inbound_id_to_delete = inbound_id
    },
    async delete_inbound() {
      if (this.inbound_id_to_delete) {
        await this.DeleteInbound(this.inbound_id_to_delete)
        this.inbound_id_to_delete = null
        this.delete_inbound_dialog = false
        this.$router.go({name: 'inbounds'});
      }
    },
    total_form_valid() {
      return this.valid
    },
    randomPort: function () {
      return Math.floor(Math.random() * (65536 - 10000) + 10000);
    },
    showDialog: function (inbound_id = null) {
      if (inbound_id) {
        this.inbound_vars = JsonToConfig(this.find_inbound(inbound_id))
        if(this.inbound_vars.expire){
          this.inbound_vars.expire = new Date(this.inbound_vars.expire * 1000)
        }
      } else {
        this.inbound_vars = GetDefaultConfig()
      }
      this.inbound_form_dialog = true
    },
    updateForm: function () {
      this.inbound_vars.uid = uuidv4()
    },
    updateTransmissionForm: function () {
      this.inbound_vars.masquerade = this.masquerades[0]
    },
    updateProtocolForm: function () {
      this.inbound_vars.tls = false
      this.inbound_vars.xtls = false
      this.inbound_vars.password_authentication = false
      this.inbound_vars.enable_udp = false
    },
    createNewHeader: function () {
      this.inbound_vars.request_headers.push({id: this.randomPort()})
    },
    removeHeader: function (header_id) {
      for (let i = 0; i < this.inbound_vars.request_headers.length; i++) {
        if (this.inbound_vars.request_headers[i].id === header_id) {
          this.inbound_vars.request_headers.splice(i, 1)
        }
      }
    },
    createNewFallback: function () {
      this.inbound_vars.fallbacks.push({id: this.randomPort()})
    },
    removeFallback: function (fallback_id) {
      for (let i = 0; i < this.inbound_vars.fallbacks.length; i++) {
        if (this.inbound_vars.fallbacks[i].id === fallback_id) {
          this.inbound_vars.fallbacks.splice(i, 1)
        }
      }
    },
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
      NewConfig.append("protocol", this.inbound_vars.protocol)
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
      switch (this.inbound_vars.protocol) {
        case 'vmess':
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
          stream_settings = this.get_stream()
          break
        case 'vless':
          // let fallbacks = []
          // for (let i=0; i++; i<this.fallbacks.length){
          //   fallbacks.push(
          //       {
          //         name: this.fallback_name,
          //         alpn: this.fallbacks[i]
          //       }
          //   )
          // }
          settings = {
            "clients": [
              {
                "id": this.inbound_vars.uid,
                "email": this.inbound_vars.uid + "@xview.local",
                "flow": "xtls-rprx-direct"
              }
            ],
            "decryption": "none",
            "fallbacks": []
          }
          stream_settings = this.get_stream()
          break
        case 'trojan':
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
          stream_settings = this.get_stream()
          stream_settings = Object.assign(stream_settings, {
            "tcpSettings": {
              "acceptProxyProtocol": this.inbound_vars.acceptProxyProtocol,
              "header": {
                "type": "none"
              }
            }
          })
          break
        case 'shadowsocks':
          settings = {
            "method": this.inbound_vars.shadowsocks_encryption,
            "password": this.inbound_vars.shadowsocks_password,
            "network": this.inbound_vars.network
          }

          stream_settings = this.get_stream()
          break
        case 'dokodemo-door':
          settings = {
            "address": this.inbound_vars.destination_address,
            "port": this.inbound_vars.destination_port,
            "network": this.inbound_vars.network
          }
          this.inbound_vars.transmission = 'tcp'
          stream_settings = this.get_stream()
          break
        case 'socks':
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
            }
          } else {
            settings = {
              "auth": "noauth",
              "udp": this.inbound_vars.enable_udp,
              "ip": this.inbound_vars.socks_ip
            }
          }

          this.inbound_vars.transmission = ''
          stream_settings = this.get_stream()
          break
        case 'http':
          settings = {
            "accounts": [
              {
                "user": this.inbound_vars.username,
                "pass": this.inbound_vars.password
              }
            ]
          }
          this.inbound_vars.transmission = ''
          stream_settings = this.get_stream()
          break
      }
      NewConfig.append("protocol_setting", JSON.stringify(settings))
      NewConfig.append("transport", JSON.stringify(stream_settings))
      if (this.inbound_vars.update) {
        await this.UpdateInbound({id: this.inbound_vars.id, data: NewConfig})
      } else {
        await this.AddInbound(NewConfig)
      }
      
      this.loading = false
      this.inbound_form_dialog = false
      this.$router.go({name: 'inbound'})
    },
    show_qrcode: function (inbound_id) {
      let inbound = JSON.parse(JSON.stringify(this.find_inbound(inbound_id)))
      this.config_string = MakeConfigString(inbound)
      this.qrcode_dialog = true
    }
  },
  computed: {
    ...mapGetters('certificate',
        {
          getCertificateList: 'getCertificateList',
        }),
    ...mapGetters('inbounds',
        {
          getInboundList: 'getInboundList',
          getInboundDetails: 'getInboundDetails',
          getStatus: 'getStatus',
        }
    )

  },
  async mounted() {
    await this.listCertificate()
    this.certificates = this.getCertificateList

    await this.ListInbounds()
    this.inbounds = this.getInboundList
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
