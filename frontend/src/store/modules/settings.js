import {HTTP} from "@/store/utils";
import {SETTINGS} from '../constants'
import {getToken} from '../utils/token'
import router from "@/router";


const state = () => ({
    status: null,
    captcha: {},
    telegram: {}
})

const getters = {
    getStatus: state => state.status,
    getCaptcha: state => state.captcha,
    getTelegram: state => state.telegram,
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
    [SETTINGS.LOAD_SITE_KEY]: (state, result) => {
        if (result.data.length > 0){
            state.captcha['site_key'] = result.data[0].site_key
        }
        state.status = result.status
    },
    [SETTINGS.UPDATE_TELEGRAM]: (state, result) => {
        state.status = result.status
    },
    [SETTINGS.LOAD_TELEGRAM]: (state, result) => {
        state.telegram = {}
        if(result.data.length > 0){
            state.telegram = result.data[0]
        }
        state.status = result.status
    },
    [SETTINGS.ERROR]: (state, payload) => {
        if (payload.response.status === 401){
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
