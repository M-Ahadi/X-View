import {RandomPort} from "@/store/utils";

export const CreateNewHeader = function (inbound_vars) {
    inbound_vars.request_headers.push({id: RandomPort()})
    return inbound_vars
}
export const RemoveHeader = function (header_id,inbound_vars) {
    for (let i = 0; i < inbound_vars.request_headers.length; i++) {
        if (inbound_vars.request_headers[i].id === header_id) {
            inbound_vars.request_headers.splice(i, 1)
        }
    }
    return inbound_vars
}

export const CreateNewFallback = function (inbound_vars) {
    inbound_vars.fallbacks.push({id: RandomPort()})
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
    if (inbound_vars.tls) {
        return {
            "security": "tls",
            "tlsSettings": {
                "serverName": inbound_vars.serverName,
                "alpn": inbound_vars.alpn
            }
        }
    } else if (inbound_vars.xtls) {
        return {
            "security": "xtls",
            "xtlsSettings": {
                "serverName": inbound_vars.serverName,
                "alpn": inbound_vars.alpn
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
export const KcpConfig = function () {

}
export const WsConfig = function (inbound_vars) {
    let config = {
        "network": inbound_vars.transmission,
        "wsSettings": {
            "acceptProxyProtocol": false,
            "path": inbound_vars.path,
            "headers": {}
        }
    }
    return Object.assign(config, GetTls(inbound_vars))
}
export const HttpConfig = function () {

}
export const QuicConfig = function () {

}
export const GrpcConfig = function () {

}
export const GetStream = function (inbound_vars) {
    let stream_config = null
    switch (inbound_vars.transmission) {
        case 'tcp':
            stream_config = TcpConfig(inbound_vars)
            break
        case 'kcp':
            stream_config = KcpConfig(inbound_vars)
            break
        case 'ws':
            stream_config = WsConfig(inbound_vars)
            break
        case 'http':
            stream_config = HttpConfig()
            break
        case 'quic':
            stream_config = QuicConfig()
            break
        case 'grpc':
            stream_config = GrpcConfig()
            break
    }
    return stream_config
}