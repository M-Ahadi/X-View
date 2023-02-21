import Vuex from 'vuex'
// import createPersistedState from "vuex-persistedstate";
import auth from "@/store/modules/auth";
import certificate from "@/store/modules/certificate";
import inbounds from "@/store/modules/inbounds";
import settings from "@/store/modules/settings";


const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        auth,
        inbounds,
        certificate,
        settings
    },
    strict: debug
    // plugins: [createPersistedState()]

})