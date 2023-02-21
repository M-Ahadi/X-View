<template>
  <div></div>
</template>

<script>
import {mapActions} from "vuex";
import {USER} from "@/store/constants";
export default {
  name: "LogoutView",
  methods: {
    ...mapActions("auth", {
      LogOut: USER.LOGOUT
    }),
  },
  async mounted() {
    await this.LogOut()
    this.$router.go({name: 'login'});
  },
}
</script>

<style scoped>

</style>