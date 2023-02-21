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
      <div id="qrcode" class="align-content-center justify-center d-flex"></div>
      <v-card-actions>
        <v-snackbar
            :timeout="1000"
            rounded="pill"
            color="primary"
            variant="elevated"
            class="text-center align-content-center justify-center d-flex"
            content-class="text-center align-content-center justify-center d-flex"
        >
          <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                rounded="pill"
                x-large
                block
                variant="elevated"
                color="blue-grey"
                @click="clipboardData"
            >{{ $t('message.copy') }}
            </v-btn>
          </template>

          {{ $t('message.copied') }}
        </v-snackbar>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
import QRCode from '@keeex/qrcodejs-kx'

export default {
  name: "QrcodePage",
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
      show_alert: false,
      btn_name: '',
      overlay: false
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
    }
  }
}
</script>

<style scoped>

</style>