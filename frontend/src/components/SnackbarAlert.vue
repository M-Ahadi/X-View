<template>
  <v-snackbar
      v-model="snackbar_show"
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn
          color="pink"
          variant="text"
          @click='snackbar_show = false'
      >
        Close
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
  watch: {
    "snackbar_show": function (value) {
      if(value === false){
        this.$emit("ShowSnackbar", false)
      }
    }
  },

}
</script>

<style scoped>

</style>