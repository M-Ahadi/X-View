import {HTTP} from "@/store/utils";
import {SETTINGS} from '../constants'
import {getToken} from '../utils/token'
import router from "@/router";


const state = () => ({
    status: null,
    captcha: {},
    telegram: {},
    nginx: {}
})

const getters = {
    getStatus: state => state.status,
    getTelegram: state => state.telegram,
    getCaptcha: state => state.captcha,
    getNginx: state => state.nginx,
    getSiteKey: state => state.captcha.site_key,
}

const actions = {
    [SETTINGS.LOAD_CAPTCHA]: async ({commit}) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.get('captcha/', {headers: header})
            .then((result) => {
                commit(SETTINGS.LOAD_CAPTCHA, result)
            }).catch((error) => {
                commit(SETTINGS.ERROR,error)
                console.error("error", error)
            })
    },
    [SETTINGS.LOAD_SITE_KEY]: async ({commit}) => {
        await HTTP.get('sitekey/')
            .then((result) => {
                commit(SETTINGS.LOAD_SITE_KEY, result)
            }).catch((error) => {
                commit(SETTINGS.ERROR,error)
                console.error("error", error)
            })
    },
    [SETTINGS.UPDATE_CAPTCHA]: async ({commit}, payload)  => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.post('captcha/', payload,{headers: header})
            .then((result) => {
                commit(SETTINGS.UPDATE_CAPTCHA, result)
            }).catch((error) => {
                commit(SETTINGS.ERROR,error)
                console.error("error", error)
            })
    },
    [SETTINGS.LOAD_TELEGRAM]: async ({commit}) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.get('telegram/', {headers: header})
            .then((result) => {
                commit(SETTINGS.LOAD_TELEGRAM, result)
            }).catch((error) => {
                commit(SETTINGS.ERROR,error)
                console.error("error", error)
            })

    },
    [SETTINGS.UPDATE_TELEGRAM]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.post('telegram/', payload, {headers: header})
            .then((result) => {
                commit(SETTINGS.UPDATE_TELEGRAM, result)
            }).catch((error) => {
                commit(SETTINGS.ERROR,error)
                console.error("error", error)
            })

    },

    [SETTINGS.LOAD_NGINX]: async ({commit}) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.get('nginx/', {headers: header})
            .then((result) => {
                commit(SETTINGS.LOAD_NGINX, result)
            }).catch((error) => {
                commit(SETTINGS.ERROR,error)
                console.error("error", error)
            })

    },
    [SETTINGS.UPDATE_NGINX]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.post('nginx/', payload, {headers: header})
            .then((result) => {
                commit(SETTINGS.UPDATE_NGINX, result)
            }).catch((error) => {
                commit(SETTINGS.ERROR,error)
                console.error("error", error)
            })

    },

}


const mutations = {
    [SETTINGS.UPDATE_CAPTCHA]: (state, payload) => {
        state.status = payload.status
    },
    [SETTINGS.LOAD_CAPTCHA]: (state, result) => {
        state.captcha = {
            'site_key': '',
            'secret_key': '',
            'enable': false,
        }
        if (result.data.length > 0){
            state.captcha = result.data[0]
        }
        state.status = result.status
    },
    [SETTINGS.LOAD_SITE_KEY]: (state, payload) => {
        if (payload.data.length > 0){
            state.captcha['site_key'] = payload.data[0].site_key
        }
        state.status = payload.status
    },
    [SETTINGS.UPDATE_TELEGRAM]: (state, payload) => {
        state.status = payload.status
    },
    [SETTINGS.LOAD_TELEGRAM]: (state, payload) => {
        state.telegram = {}
        if(payload.data.length > 0){
            state.telegram = payload.data[0]
        }
        state.status = payload.status
    },
    [SETTINGS.UPDATE_NGINX]: (state, payload) => {
        state.status = payload.status
    },
    [SETTINGS.LOAD_NGINX]: (state, payload) => {
        state.nginx = {}
        if(payload.data.length > 0){
            state.nginx = payload.data[0]
        }
        state.status = payload.status
    },
    [SETTINGS.ERROR]: (state, payload) => {
        if (payload.code === "ERR_NETWORK"){
            state.status = 500
            return
        }
        if (payload.response && payload.response.status === 401){
            router.push({name: 'logout'});
        }
        state.status = payload.response.status
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
