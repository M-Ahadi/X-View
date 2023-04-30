import {HTTP} from "@/store/utils";
import {CERTIFICATE} from '../constants'
import {getToken} from '../utils/token'
import router from "@/router";


const state = () => ({
    certificates: [],
    status: null,
    result: null,
})

const getters = {
    getCertificateList: state => state.certificates,
    getStatus: state => state.status,
    getResult: state => state.result
}

const actions = {
    [CERTIFICATE.LIST_CERTIFICATE]: async ({commit}) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.get('certificate/', {headers: header})
            .then((result) => {
                commit(CERTIFICATE.LIST_CERTIFICATE, result)
            }).catch((error) => {
                commit(CERTIFICATE.ERROR, error)
                console.error("error", error)
            })
    },
    [CERTIFICATE.ADD_CERTIFICATE]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.post('certificate/', payload, {headers: header})
            .then((result) => {
                commit(CERTIFICATE.ADD_CERTIFICATE, result)
            }).catch((error) => {
                commit(CERTIFICATE.ERROR, error)
                console.error("error", error)
            })

    },
    [CERTIFICATE.UPDATE_CERTIFICATE]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.patch('certificate/' + payload.id + "/", payload.data, {headers: header})
            .then((result) => {
                commit(CERTIFICATE.UPDATE_CERTIFICATE, result)
            }).catch((error) => {
                commit(CERTIFICATE.ERROR, error)
                console.error("error", error)
            })

    },
    [CERTIFICATE.DELETE_CERTIFICATE]: async ({commit}, id) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.delete('certificate/' + id + '/', {headers: header}).then((result) => {
            commit(CERTIFICATE.DELETE_CERTIFICATE, result)
        }).catch((error) => {
            commit(CERTIFICATE.ERROR, error)
            console.error("error", error)
        })
    },
}


const mutations = {
    [CERTIFICATE.LIST_CERTIFICATE]: (state, payload) => {
        state.certificates = payload.data
        state.status = payload.status
    },
    [CERTIFICATE.ADD_CERTIFICATE]: (state, payload) => {
        state.status = payload.status
    },
    [CERTIFICATE.UPDATE_CERTIFICATE]: (state, payload) => {
        state.status = payload.status
    },
    [CERTIFICATE.DELETE_CERTIFICATE]: (state, payload) => {
        state.status = payload.status
    },
    [CERTIFICATE.ERROR]: (state, payload) => {
        if (payload.response.status === 401){
            router.push({name: 'logout'});
        }
        state.status = payload.response.status
        if (payload.response.data.non_field_errors ){
            state.result = payload.response.data.non_field_errors[0]
        }

    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
