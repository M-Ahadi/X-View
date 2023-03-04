import {HTTP} from "@/store/utils";
import {getToken} from '../utils/token'
import {USER} from "@/store/constants";

const state = () => ({
    token: localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN) || '',
    refreshToken: localStorage.getItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN) || '',
    isAuthenticated: (localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN) && localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN) !== 'undefined'),
    status: null
});

const getters = {
    getStatus: state => state.status,

    isAuthenticated: state => state.isAuthenticated,
    getToken: () => {
        let token_json = JSON.parse(localStorage.getItem("vuex"))
        return token_json && token_json.auth && token_json.auth.token
    },
    getRefreshToken: () => {
        let token_json = JSON.parse(localStorage.getItem("vuex"))
        return token_json && token_json.auth && token_json.auth.refreshToken
    },
    tokenIsValid: () => {
        // var decodedToken = jwt_decode(state.token);
        // return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
    }
};


const actions = {
    [USER.LOGIN]: async ({commit}, Payload) => {
        return await HTTP.post('login/', Payload)
            .then((response) => {
                commit(USER.LOGIN, response)
            })
            .catch(function (error) {
                commit(USER.ERROR, error)
                console.error("error",error)
            });
    },
    [USER.LOGOUT]: async ({commit}) => {
        commit(USER.LOGOUT);
    },
    [USER.REFRESH_TOKEN]: async () => {
        await getToken()
    },
    [USER.CHANGE_PASSWORD]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.post('change_password/', payload, {headers: header})
            .then((result) => {
                commit(USER.CHANGE_PASSWORD, result)
            }).catch((error) => {
                commit(USER.ERROR, error)
                console.error("error", error)
            })
    }

};

const mutations = {
    [USER.LOGIN]: (state, payload) => {
        localStorage.setItem(process.env.VUE_APP_AUTH_TOKEN, payload.data.access)
        localStorage.setItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN, payload.data.refresh)
        state.token = payload.data.access
        state.refreshToken = payload.data.refresh
        state.isAuthenticated = localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN) && localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN) !== 'undefined'
        state.status = payload.status
    },
    [USER.LOGOUT]: (state) => {
        state.token = null
        state.refreshToken = null
        localStorage.removeItem(process.env.VUE_APP_AUTH_TOKEN)
        localStorage.removeItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN)
        state.isAuthenticated = false
    },
    [USER.CHANGE_PASSWORD]: (state,payload) => {
        state.status = payload.status
    },
    [USER.ERROR]: (state,payload) => {
        state.status = payload.response.status
    },

};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
