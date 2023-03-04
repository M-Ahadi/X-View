<template>
  <v-container>
    <v-row justify="space-between" class="text-start">
      <v-col>
        <v-menu
            location="end"
        >
          <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                flat
                icon="mdi-plus"
                color="primary"
                variant="flat"
            >
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                class="px-3"
                density="compact"
                v-for="item in protocols"
                :key="item"
                :title="item"
                @click="ShowForm(item)"
            >
            </v-list-item>
          </v-list>
        </v-menu>
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
                      @click="ShowForm(item.protocol,item.id)"
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
    <QrcodePage
        :text="config_string"
        error-level="L"
        @CloseQrcode="qrcode_dialog = false"
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
      <v-card-title class="headline inbound_title" justify>
        {{ $t('message.add_inbound') }} {{ selected_form }}
      </v-card-title>
      <v-container>

        <VlessForm
            v-if="selected_form === 'vless'"
            :inbound="inbound_to_load"
            @CloseForm="inbound_form_dialog = false"
        />

        <VmessForm
            v-if="selected_form === 'vmess'"
            :inbound="inbound_to_load"
            @CloseForm="inbound_form_dialog = false"
        />
        <ShadowsocksForm
            v-if="selected_form === 'shadowsocks'"
            :inbound="inbound_to_load"
            @CloseForm="inbound_form_dialog = false"
        />
        <TrojanForm
            v-if="selected_form === 'trojan'"
            :inbound="inbound_to_load"
            @CloseForm="inbound_form_dialog = false"
        />
        <DokodemoDoor
            v-if="selected_form === 'dokodemo-door'"
            :inbound="inbound_to_load"
            @CloseForm="inbound_form_dialog = false"
        />

        <SocksForm
            v-if="selected_form === 'socks'"
            :inbound="inbound_to_load"
            @CloseForm="inbound_form_dialog = false"
        />

        <HttpForm
            v-if="selected_form === 'http'"
            :inbound="inbound_to_load"
            @CloseForm="inbound_form_dialog = false"
        />
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
import {mapActions, mapGetters} from "vuex";
import {INBOUND, PROTOCOLS} from "@/store/constants";
import {CERTIFICATE} from "@/store/constants";
import {JsonToConfig} from '@/store/modules/protocol'
import {MakeConfigString} from "@/store/modules/qrcode";
import VlessForm from "@/components/inbounds/VlessForm";
import VmessForm from "@/components/inbounds/VmessForm";
import ShadowsocksForm from "@/components/inbounds/ShadowsocksForm";
import TrojanForm from "@/components/inbounds/TrojanForm";
import DokodemoDoor from "@/components/inbounds/dokodemo-door";
import SocksForm from "@/components/inbounds/SocksForm";
import HttpForm from "@/components/inbounds/HttpForm";

export default {
  name: "InboundListView",
  components: {
    HttpForm,
    SocksForm,
    DokodemoDoor,
    TrojanForm,
    ShadowsocksForm,
    VmessForm,
    VlessForm,
    QrcodePage,
  },
  data() {
    return {
      selected_form: '',
      inbound_to_load: null,
      config_string: '',
      inbounds: [],
      protocols: PROTOCOLS,
      qrcode_dialog: false,
      inbound_form_dialog: false,
      delete_inbound_dialog: false,
      inbound_id_to_delete: null,
      loading: false,
    }
  },
  methods: {
    ...mapActions("inbounds", {
      ListInbounds: INBOUND.LIST_INBOUNDS,
      GetInbound: INBOUND.GET_INBOUND,
      DeleteInbound: INBOUND.DELETE_INBOUND,
      UpdateStatus: INBOUND.UPDATE_STATUS,
    }),
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
    }),
    ShowForm(protocol, inbound_id = null) {
      this.selected_form = protocol
      if (inbound_id) {
        this.inbound_to_load = JsonToConfig(this.find_inbound(inbound_id))
      } else {
        this.inbound_to_load = null
      }
      this.inbound_form_dialog = true
    },
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
    show_qrcode: function (inbound_id) {
      let inbound = JSON.parse(JSON.stringify(this.find_inbound(inbound_id)))
      this.config_string = MakeConfigString(inbound)
      this.qrcode_dialog = true
    }
  },
  computed: {
    ...mapGetters('inbounds',
        {
          getInboundList: 'getInboundList',
          getInboundDetails: 'getInboundDetails',
          getStatus: 'getStatus',
        }
    )

  },
  async mounted() {

    await this.ListInbounds()
    this.inbounds = this.getInboundList
  },
}
</script>

<style scoped>
.inbound_title {
  text-transform: capitalize;
}
</style>
