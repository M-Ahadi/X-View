<template>
  <v-snackbar
      v-model="snackbar_show"
      :timeout="1000"
      rounded="pill"
      color="primary"
      variant="elevated"
      class="text-center align-content-center justify-center d-flex"
      content-class="text-center align-content-center justify-center d-flex"
      @update:modelValue='$emit("showSnackbar", false)'
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn
          color="pink"
          variant="text"
          @click='$emit("showSnackbar", false)'
      >
        {{$t("message.close")}}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackbarAlert",
  props: {
    text: {type: String, required: true},
  },
  data() {
    return {
      snackbar_show: false,
    }
  },
  mounted() {
    this.snackbar_show = true
  },

}
</script>

<style scoped>

</style>