import {RandomNumber} from "@/store/utils";

const MakeHeaderDict = function (headers){
    let header_dic = {}
    for(let i=0; i< headers.length; i++){
        header_dic[headers[i].header_name] = headers[i].header_value
    }
    return header_dic
}

export const CreateNewHeader = function (inbound_vars) {
    inbound_vars.request_headers.push({id: RandomNumber()})
    return inbound_vars
}
export const RemoveHeader = function (header_id,inbound_vars) {
    inbound_vars.request_headers = inbound_vars.request_headers ? inbound_vars.request_headers: []
    for (let i = 0; i < inbound_vars.request_headers.length; i++) {
        if (inbound_vars.request_headers[i].id === header_id) {
            inbound_vars.request_headers.splice(i, 1)
        }
    }
    return inbound_vars
}

export const CreateNewFallback = function (inbound_vars) {
    inbound_vars.fallbacks.push({id: RandomNumber()})
    return inbound_vars
}
export const RemoveFallback = function (fallback_id,inbound_vars) {
    for (let i = 0; i < inbound_vars.fallbacks.length; i++) {
        if (inbound_vars.fallbacks[i].id === fallback_id) {
            inbound_vars.fallbacks.splice(i, 1)
        }
    }
    return inbound_vars
}
export const GetTls = function (inbound_vars) {
    let headers = {}
    for (let i = 0; i++; i < inbound_vars.request_headers.length) {
        headers[inbound_vars.request_headers[i].header_name] = inbound_vars.request_headers[i].header_value
    }
    let alpn = []
    if (inbound_vars.h1){
        alpn.push("http/1.1")
    }
    if (inbound_vars.h2){
        alpn.push("h2")
    }

    if (inbound_vars.tls) {
        return {
            "security": "tls",
            "tlsSettings": {
                "serverName": inbound_vars.serverName,
                "alpn": alpn.join(",")
            }
        }
    } else if (inbound_vars.xtls) {
        return {
            "security": "xtls",
            "xtlsSettings": {
                "serverName": inbound_vars.serverName,
                "alpn": alpn.join(",")
            }
        }
    } else {
        return {
            "security": "none",
        }
    }
}
export const TcpConfig = function (inbound_vars) {
    let header = {}
    if (inbound_vars.http_masquerade) {
        header = {
            "type": "http",
            "request": {
                "version": inbound_vars.request_version || '1.1',
                "method": inbound_vars.request_method || 'GET',
                "path": [
                    inbound_vars.request_path || '/'
                ],
                "headers": {}
            },
            "response": {
                "version": inbound_vars.response_version || '1.1',
                "status": inbound_vars.response_status || '200',
                "reason": inbound_vars.response_status_description || 'OK',
                "headers": {}
            }
        }
    } else {
        header = {"type": "none"}
    }
    let config = {
        "network": "tcp",
        "tcpSettings": {
            "acceptProxyProtocol": inbound_vars.acceptProxyProtocol,
            "header": header
        }
    }
    return Object.assign(config, GetTls(inbound_vars))
}



export const KcpConfig = function (inbound_vars) {
    return  {
        "network": inbound_vars.transmission,
        "kcpSettings": {
            "mtu": inbound_vars.mtu,
            "tti": inbound_vars.tti,
            "uplinkCapacity": inbound_vars.uplikCapacity,
            "downlinkCapacity": inbound_vars.downlinkCapacity,
            "congestion": inbound_vars.congestion,
            "readBufferSize": inbound_vars.readBufferSize,
            "writeBufferSize": inbound_vars.writeBufferSize,
            "header": {
                "type": inbound_vars.masquerade.value
            },
            "seed": inbound_vars.password
        }
    }
}


export const WsConfig = function (inbound_vars) {
    let config = {
        "network": inbound_vars.transmission,
        "wsSettings": {
            "acceptProxyProtocol": false,
            "path": inbound_vars.path,
            "headers": MakeHeaderDict(inbound_vars.request_headers)
        }
    }
    return Object.assign(config, GetTls(inbound_vars))
}
export const HttpConfig = function (inbound_vars) {
    let config = {
        "network": inbound_vars.transmission,
        "httpSettings": {
            "host": inbound_vars.host,
            "path": inbound_vars.path,
            "read_idle_timeout": 10,
            "health_check_timeout": 15,
            "method": "PUT",
            "headers": {
                "Header": "none"
            }
        }
    }
    return Object.assign(config, GetTls(inbound_vars))
}
export const QuicConfig = function (inbound_vars) {
    return {
        "network": inbound_vars.transmission,
        "quicSettings": {
            "security": inbound_vars.encryption,
            "key": inbound_vars.password,
            "header": {
                "type": inbound_vars.masquerade.value
            }
        }
    }
}
export const GrpcConfig = function (inbound_vars) {
    return {
        "network": inbound_vars.transmission,
        "grpcSettings": {
            "serviceName": inbound_vars.service_name,
            "multiMode": false,
            "idle_timeout": 60,
            "health_check_timeout": 20,
            "permit_without_stream": false,
            "initial_windows_size": 0
        }
    }
}


export const GetStream = function (inbound_vars) {
    switch (inbound_vars.transmission) {
        case 'tcp':
            return TcpConfig(inbound_vars)
        case 'kcp':
            return KcpConfig(inbound_vars)
        case 'ws':
            return WsConfig(inbound_vars)
        case 'http':
            return HttpConfig(inbound_vars)
        case 'quic':
            return QuicConfig(inbound_vars)
        case 'grpc':
            return GrpcConfig(inbound_vars)
    }
}