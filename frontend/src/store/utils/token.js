import {HTTP} from "@/store/utils";

export function tokenIsValid(token) {
    if (token) {
        const b64 = token.split(".")[1]
        return JSON.parse(atob(b64)).exp * 1000 > new Date().getTime()
    }
    return false
}

export async function getToken() {
    let token = localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN)
    let refreshtoken = localStorage.getItem(process.env.VUE_APP_AUTH_REFRESH_TOKEN)
    if (! tokenIsValid(token)) {
        if (token && token !== 'undefined' && refreshtoken && refreshtoken !== 'undefined') {
            const result = await RefreshToken()
            if (result.status){
                localStorage.setItem(process.env.VUE_APP_AUTH_TOKEN, result.data.access)
            }
        }
    }
    token = localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN)
    if (token && token !== 'undefined') {
        return token
    }
}


export async function RefreshToken (token,refreshtoken){
    let header = {}
    header['Authorization'] = 'Bearer ' + token || ''
    const payload = {'refresh': refreshtoken}
    return await HTTP.post('token/refresh/', payload, {headers: header})
}