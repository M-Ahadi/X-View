<template>
  <v-container
      fluid
      class="bg-grey-lighten-3"
  >
    <v-row justify="space-between" class="text-start">
      <v-col
          md="8"
          ms="12"
          class="mx-auto"
      >
        <v-btn
            icon="mdi-plus"
            color="primary"
            variant="flat"
            @click="showDialog()"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-between" class="text-left">
      <v-col
          md="8"
          ms="12"
          class="mx-auto"
      >
        <v-table
            fixed-header
            height="400px"
            class="elevation-1 rounded-xl"
        >
          <thead>
          <tr>
            <th>{{ $t('message.manage') }}</th>
            <th>{{ $t('message.certificate_name') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in certificates"
              :key="item.id"
              class="text-left"
          >
            <td>
              <v-btn
                  icon="mdi-delete"
                  color="primary"
                  variant="flat"
                  size="small"
                  @click="ask_delete_certificate(item.id)"
              ></v-btn>
              <v-btn
                  icon="mdi-square-edit-outline"
                  color="primary"
                  variant="flat"
                  size="small"
                  @click="showDialog(item.id)"

              ></v-btn>
            </td>
            <td>{{ item.name }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog
        v-model="certificate_form_dialog"
        width="500"
    >
      <v-card
          elevation="0"
          class=" my-10  pb-5"
          max-width="600px"
      >
        <v-card-title class="headline" justify>
          {{ $t("message.add_certificate") }}
        </v-card-title>
        <v-container>
          <v-form
              @submit.prevent="submit"
              v-model="valid"
          >
            <v-text-field
                v-model="certificate_data.name"
                :label='$t("message.certificate_name")'
                solo
                :rules="[rules.required]"
            ></v-text-field>
            <v-textarea
                v-model="certificate_data.certificate"
                :label='$t("message.certificate")'
                :rules="[rules.required, rules.isCertificate]"
            ></v-textarea>
            <v-textarea
                v-model="certificate_data.privatekey"
                :label='$t("message.privatekey")'
                :rules="[rules.required, rules.isPrivatekey]"
            ></v-textarea>
            <v-row>
              <v-col>
                <v-btn
                    v-if="! certificate_data.id"
                    type="submit"
                    block
                    color="secondary"
                    :loading="loading"
                    elevation="3"
                    :disabled="!valid"
                >{{ $t("message.add") }}
                </v-btn>
                <v-btn
                    v-if="!!certificate_data.id"
                    type="submit"
                    block
                    color="secondary"
                    :loading="loading"
                    elevation="3"
                    :disabled="valid === false"
                >{{ $t("message.update") }}
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                    tx-large
                    block
                    outlined
                    color="gray"
                    @click="certificate_form_dialog = false"
                >{{ $t("message.cancel") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <p v-if="showError" id="error">{{ error_message }}</p>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="delete_certificate_dialog"
        max-width="400px"
    >
      <v-card
          elevation="0"
          class=" my-10  pb-5"
          max-width="600px"
          rounded
      >
        <v-card-title class="headline" justify>
          {{ $t('message.delete_certificate') }}
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
                  @click="delete_certificate"
              >{{ $t('message.yes') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                  block
                  color="secondary"
                  :loading="loading"
                  elevation="3"
                  @click="delete_certificate_dialog= !delete_certificate_dialog"
              >{{ $t('message.cancel') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {CERTIFICATE} from "@/store/constants";

export default {
  name: "CertificateManagementView",
  data() {
    return {
    from: null,
    valid: false,
    loading: false,
    certificate_data: {
      name: '',
      certificate: '',
      privatekey: '',
      id: null
    },
    showError: false,
    error_message: '',
    certificate_form_dialog: false,
    delete_certificate_dialog: false,
    certificates: [],
    rules: {
      required: value => !!value || this.$t('message.required'),
      isCertificate: value => (value.trim().startsWith("-----BEGIN CERTIFICATE-----") && value.trim().endsWith("-----END CERTIFICATE-----")) || this.$t('message.bad_certificate'),
      isPrivatekey: value => (value.trim().startsWith("-----BEGIN PRIVATE KEY-----") && value.trim().endsWith("-----END PRIVATE KEY-----")) || this.$t('message.bad_privatekey')
      }
  }
  },
  methods: {
    ...mapActions("certificate", {
      listCertificate: CERTIFICATE.LIST_CERTIFICATE,
      deleteCertificate: CERTIFICATE.DELETE_CERTIFICATE,
      addCertificate: CERTIFICATE.ADD_CERTIFICATE,
      updateCertificate: CERTIFICATE.UPDATE_CERTIFICATE,
    }),
    async submit() {
      this.loading = true
      const Certificate = new FormData();
      Certificate.append("name", this.certificate_data.name.trim());
      Certificate.append("certificate", this.certificate_data.certificate.replaceAll("\r",'').replaceAll("\n",",").trim());
      Certificate.append("privatekey", this.certificate_data.privatekey.replaceAll("\r",'').replaceAll("\n",",").trim());
      if (this.certificate_data && this.certificate_data.id) {
        await this.updateCertificate({id:this.certificate_data.id,data: Certificate})
        switch (this.getStatus) {
          case 200: {
            this.showError = false
            this.loading = false
            this.$router.go({name: 'certificates'});
            break
          }
          case 400:{
            this.error_message = this.getResult
            this.showError = true
            this.loading = false
            break
          }
          default: {
            this.error_message = this.$t("message.service_unavailable")
            this.showError = true
            this.loading = false
            break
          }
        }
      }else {
        await this.addCertificate(Certificate)
        switch (this.getStatus) {
          case 201: {
            this.showError = false
            this.loading = false
            this.$router.go({name: 'certificates'});
            break
          }
          default : {
            this.error_message = this.$t("message.service_unavailable")
            this.showError = true
            this.loading = false
            break
          }
        }
      }
    },
    showDialog: function (certificate_id=null) {
      if (certificate_id){
        for (let i=0; i< this.certificates.length; i++){
          if (this.certificates[i].id === certificate_id){
            this.certificate_data = JSON.parse(JSON.stringify(this.certificates[i]));
          }
        }
      }
      else{
        this.certificate_data = {}
      }
      this.certificate_form_dialog = true
    },
    async delete_certificate() {
      await this.deleteCertificate(this.certificate_data.id)
      this.$router.go({name: "certificates"})
    },
    ask_delete_certificate(certificate_id) {
      this.certificate_data.id = certificate_id
      this.delete_certificate_dialog = true
    }

  },
  computed: {
    ...mapGetters('certificate',
        {
          getCertificates: 'getCertificateList',
          getStatus: 'getStatus',
          getResult: 'getResult'
    })
  },
  async mounted() {
    await this.listCertificate()
    this.certificates = JSON.parse(JSON.stringify(this.getCertificates))
    for(let i=0; i < this.certificates.length; i++){
      this.certificates[i].certificate = this.certificates[i].certificate.replaceAll(",","\n")
      this.certificates[i].privatekey = this.certificates[i].privatekey.replaceAll(",","\n")
    }
  }

}
</script>

<style scoped>

</style>
