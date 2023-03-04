import {HTTP} from "@/store/utils";
import {INBOUND} from '../constants'
import {getToken} from '../utils/token'
import router from "@/router";


const state = () => ({
    inbounds: [],
    inbound: null,
    status: '',
})

const getters = {
    getInboundList: state => state.inbounds,
    getStatus: state => state.status,
    getCount: state => state.count,
    getInboundDetails: state => state.inbound
}

const actions = {
    [INBOUND.LIST_INBOUNDS]: async ({commit}) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.get('inbounds/', {headers: header})
            .then((result) => {
                commit(INBOUND.LIST_INBOUNDS, result)
            }).catch((error) => {
                commit(INBOUND.ERROR,error)
                console.error("error", error)
            })
    },
    [INBOUND.GET_INBOUND]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.get('inbounds/' + payload + '/', {headers: header})
            .then((result) => {
                commit(INBOUND.GET_INBOUND, result.data)
            }).catch((error) => {
                commit(INBOUND.ERROR,error)
                console.error("error", error)
            })

    },
    [INBOUND.ADD_INBOUND]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.post('inbounds/', payload, {headers: header})
            .then((result) => {
                commit(INBOUND.UPDATE_STATUS, result.status)
            }).catch((error) => {
                commit(INBOUND.ERROR,error)
                console.error("error", error)
            })
    },
    [INBOUND.UPDATE_INBOUND]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.patch('inbounds/' + payload.id + '/', payload.data, {headers: header})
            .then((result) => {
                commit(INBOUND.UPDATE_STATUS, result.status)
            }).catch((error) => {
                commit(INBOUND.ERROR,error)
                console.error("error", error)
            })
    },
    [INBOUND.UPDATE_STATUS]: async ({commit}, payload) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.patch('status/' + payload.id + '/', payload.data, {headers: header})
            .then((result) => {
                commit(INBOUND.UPDATE_STATUS, result.status)
            }).catch((error) => {
                commit(INBOUND.ERROR,error)
                console.error("error", error)
            })
    },
    [INBOUND.DELETE_INBOUND]: async ({commit}, id) => {
        let header = {}
        const token = await getToken()
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        await HTTP.delete('inbounds/' + id + '/', {headers: header})
            .then((result) => {
                commit(INBOUND.UPDATE_STATUS, result.status)
            }).catch((error) => {
                commit(INBOUND.ERROR,error)
                console.error("error", error)
            })
    },
}


const mutations = {
    [INBOUND.LIST_INBOUNDS]: (state, payload) => {
        state.inbounds = payload.data.results
        state.count = payload.data.count
        state.status = payload.status
    },
    [INBOUND.UPDATE_STATUS]: (state, payload) => {
        state.status = payload
    },
    [INBOUND.ERROR]: (state, payload) => {
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
