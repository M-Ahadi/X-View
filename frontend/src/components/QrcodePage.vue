<template>
  <v-row
      align="center"
      justify="center"
  >
    <v-card
        elevation="5"
        class=" my-10  pb-5"
        width="300px"
        rounded="xl"
    >
      <v-card-title class="headline" justify>
        {{ $t('message.qrcode') }}
      </v-card-title>
      <v-card-text>
      <div id="qrcode" class="align-content-center justify-center d-flex"></div>
      </v-card-text>
        <v-row class="px-5 py-4">
            <v-btn
                rounded
                block
                x-large
                variant="elevated"
                color="blue-grey"
                @click="clipboardData"

            >{{ $t('message.copy') }}
            </v-btn>
        </v-row>
          <v-row class="px-5">
            <v-btn
                block
                rounded
                x-large
                variant="elevated"
                color="blue-grey"
                @click="$emit('CloseQrcode')"
            >{{ $t('message.close') }}
            </v-btn>
        </v-row>

    </v-card>
  </v-row>
  <SnackbarAlert
      v-if="snackbar"
      :text="$t('message.copied')"
      @ShowSnackbar="snackbar = $event"
  ></SnackbarAlert>
</template>

<script>
import QRCode from '@keeex/qrcodejs-kx'
import SnackbarAlert from "@/components/SnackbarAlert";

export default {
  name: "QrcodePage",
  components: {SnackbarAlert},
  emits: ["CloseQrcode"],
  props: {
    text: {type: String, required: true},
    size: {type: Number, required: false, default: 256},
    color: {type: String, required: false, default: '#000'},
    bgColor: {type: String, required: false, default: '#FFF'},
    errorLevel: {
      type: String,
      validator: function (value) {
        return value === 'L' || value === 'M' || value === 'Q' || value === 'H'
      },
      required: false,
      default: 'H'
    }
  },
  watch: {
    text: function () {
      this.clear();
      this.makeCode(this.text);
    }
  },
  data() {
    return {
      qrCode: {},
      btn_name: '',
      overlay: false,
      snackbar: false,
    }
  },
  mounted() {
    this.qrCode = new QRCode(document.getElementById("qrcode"), {
      text: this.text,
      width: this.size,
      height: this.size,
      colorDark: this.color,
      colorLight: this.bgColor,
      correctLevel: QRCode.CorrectLevel[this.errorLevel]
    });
    this.btn_name = this.$t('message.copy')
  },
  methods: {
    clear: function () {
      this.qrCode.clear();
    },
    makeCode: function (text) {
      this.qrCode.makeCode(text);
    },
    clipboardData: function () {
      navigator.clipboard.writeText(this.text)
      this.snackbar = true
    }
  }
}
</script>

<style scoped>

</style>