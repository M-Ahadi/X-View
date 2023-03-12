import {GeneratePassword, RandomNumber, RandomPort, uuidv4} from "@/store/utils";
import {QUIC_ENCRYPTIONS, FLOWS, NETWORKS, SHADOWSOCKS_ENRYPTIONS, TRANSMISSIONS, MASQUERADES,} from "@/store/constants";

const GetHeadersList = function (headers={}){
    let header_list = []
    let headers_key = Object.keys(headers)
    for(let i=0; i< headers_key.length; i++){
        header_list.push({id:RandomNumber(), header_name : headers_key[i], header_value: headers[headers_key[i]] })
    }
    return header_list
}

const GetMasquerade = function (masquerade_type){
    for (let i=0; i< MASQUERADES.length; i++){
        if (MASQUERADES[i].value === masquerade_type ){
            return MASQUERADES[i]
        }
    }
}

let config_data = {}
export const GetVlessDefaultConfig = function (){
    return {
        update : false,
        id: '',
        password : GeneratePassword(),
        port : RandomPort(),
        uid : uuidv4(),
        transmission : TRANSMISSIONS[0],
        network : NETWORKS[0],
        request_headers : [],
        tls : false,
        xtls : false,
        acceptProxyProtocol : false,
        http_masquerade : false,
        sniffing : true,
        name : '',
        bindip : '0.0.0.0',
        disableInsecureEncryption : false,
        domain_name : '',
        alpn : '',
        h2: false,
        h1:false,
        masquerade : '',
        mtu : 1350,
        tti : 20,
        uplikCapacity : 5,
        downlinkCapacity : 20,
        congestion : false,
        readBufferSize : 2,
        writeBufferSize : 2,
        path : '/',
        host : '',
        encryption : QUIC_ENCRYPTIONS[0],
        service_name : '',
        request_version: "1.1",
        request_method: "GET",
        request_path: "/",
        response_version: "1.1",
        response_status: 200,
        response_status_description: "OK",
        header_name: ''

    }
}

export const GetVmessDefaultConfig = function (){
    return {
        update : false,
        id: '',
        password : GeneratePassword(),
        port : RandomPort(),
        uid : uuidv4(),
        transmission : TRANSMISSIONS[0],
        network : NETWORKS[0],
        request_headers : [],
        tls : false,
        xtls : false,
        acceptProxyProtocol : false,
        http_masquerade : false,
        sniffing : true,
        name : '',
        bindip : '0.0.0.0',
        disableInsecureEncryption : false,
        domain_name : '',
        alpn : '',
        h2: false,
        h1:false,
        masquerade : '',
        mtu : 1350,
        tti : 20,
        uplikCapacity : 5,
        downlinkCapacity : 20,
        congestion : false,
        readBufferSize : 2,
        writeBufferSize : 2,
        path : '/',
        host : '',
        encryption : QUIC_ENCRYPTIONS[0],
        service_name : '',
        request_version: "1.1",
        request_method: "GET",
        request_path: "/",
        response_version: "1.1",
        response_status: 200,
        response_status_description: "OK",
        header_name: ''

    }
}

export const  GetShadowsocksDefaultConfig = function () {
    return {
        update : false,
        id: null,
        password : GeneratePassword(),
        shadowsocks_password : GeneratePassword(),
        port : RandomPort(),
        transmission : TRANSMISSIONS[0],
        network : NETWORKS[0],
        request_headers : [],
        tls : false,
        xtls : false,
        acceptProxyProtocol : false,
        http_masquerade : false,
        sniffing : true,
        name : '',
        bindip : '0.0.0.0',
        disableInsecureEncryption : false,
        domain_name : '',
        alpn : '',
        h2: false,
        h1:false,
        masquerade : '',
        mtu : 1350,
        tti : 20,
        uplikCapacity : 5,
        downlinkCapacity : 20,
        congestion : false,
        readBufferSize : 2,
        writeBufferSize : 2,
        path : '/',
        host : '',
        encryption : QUIC_ENCRYPTIONS[0],
        shadowsock_encryption : SHADOWSOCKS_ENRYPTIONS[0],
        service_name : '',
        request_version: "1.1",
        request_method: "GET",
        request_path: "/",
        response_version: "1.1",
        response_status: 200,
        response_status_description: "OK",
        header_name: ''
    }
}

export const  GetTrojanDefaultConfig = function () {
    return {
        update : false,
        id: null,
        password : GeneratePassword(),
        port : RandomPort(),
        transmission : TRANSMISSIONS[0],
        request_headers : [],
        tls : false,
        xtls : false,
        sniffing : true,
        name : '',
        bindip : '0.0.0.0',
        domain_name : '',
        alpn : '',
        h2: false,
        h1:false,
        path : '/',
        host : '',
        flow: FLOWS[0],
        masquerade : '',
        mtu : 1350,
        tti : 20,
        uplikCapacity : 5,
        downlinkCapacity : 20,
        congestion : false,
        readBufferSize : 2,
        writeBufferSize : 2,
        encryption : QUIC_ENCRYPTIONS[0],
        service_name : '',
        request_version: "1.1",
        request_method: "GET",
        request_path: "/",
        response_version: "1.1",
        response_status: 200,
        response_status_description: "OK",
        header_name: '',
        acceptProxyProtocol: false

    }
}

export const  GetDokodemoDefaultConfig = function () {
    return {
        update : false,
        id: null,
        port : RandomPort(),
        network : NETWORKS[0],
        name : '',
        bindip : '0.0.0.0',
        path : '/',
        host : '',
        destination_address: "0.0.0.0",
        destination_port: RandomPort(),


    }
}

export const  GetSocksDefaultConfig = function () {
    return {
        update : false,
        id: null,
        name : '',
        bindip : '0.0.0.0',
        port : RandomPort(),
        password_authentication: true,
        enable_udp: false,
        socks_ip: "127.0.0.1",
        username: GeneratePassword(),
        password: GeneratePassword(),
    }
}

export const  GetHttpDefaultConfig = function () {
    return {
        update : false,
        id: null,
        name : '',
        bindip : '0.0.0.0',
        port : RandomPort(),
        username: GeneratePassword(),
        password: GeneratePassword(),
    }
}


function TlsXtlsJsonToConfig(json_config) {
    const transport = JSON.parse(json_config.transport)
    config_data.security = transport.security
    switch (transport.security) {
        case "tls": {
            config_data.tls = true
            config_data.serverName = transport.tlsSettings.serverName
            config_data.h2 = transport.tlsSettings.alpn.search("h2") >=0 ? "h2": ""
            config_data.h1 = transport.tlsSettings.alpn.search("http/1.1") >=0 ? "http/1.1" : ""
            config_data.alpn = transport.tlsSettings.alpn
            break
        }
        case "xtls": {
            config_data.xtls = true
            config_data.serverName = transport.xtlsSettings.serverName
            config_data.h2 = transport.tlsSettings.alpn.search("h2") >=0 ? "h2": ""
            config_data.h1 = transport.tlsSettings.alpn.search("http/1.1") >=0 ? "http/1.1" : ""
            config_data.alpn = transport.xtlsSettings.alpn
            break
        }
        case "none":{
            break
        }
    }
}
function TransportJsonToConfig(transport) {
    config_data.transmission = transport.network
    switch (transport.network) {
        case "tcp": {
            config_data.acceptProxyProtocol = transport.tcpSettings.acceptProxyProtocol
            if (transport.tcpSettings.header.request){
                config_data.http_masquerade = true
                config_data.request_version = transport.tcpSettings.header.request.version
                config_data.request_method = transport.tcpSettings.header.request.method
                config_data.request_path = transport.tcpSettings.header.request.path
                config_data.response_version = transport.tcpSettings.header.response.version
                config_data.response_status = transport.tcpSettings.header.response.status
                config_data.response_status_description = transport.tcpSettings.header.response.reason
            }
            break
        }
        case 'kcp': {
            config_data.password = transport.kcpSettings.seed
            config_data.mtu = transport.kcpSettings.mtu
            config_data.tti = transport.kcpSettings.tti
            config_data.uplikCapacity = transport.kcpSettings.uplikCapacity
            config_data.downlinkCapacity = transport.kcpSettings.downlinkCapacity
            config_data.readBufferSize = transport.kcpSettings.readBufferSize
            config_data.writeBufferSize = transport.kcpSettings.writeBufferSize
            config_data.masquerade = GetMasquerade(transport.kcpSettings.header.type)
            break
        }
        case 'ws': {
            config_data.acceptProxyProtocol = transport.wsSettings.acceptProxyProtocol
            config_data.path = transport.wsSettings.path
            config_data.request_headers = GetHeadersList(transport.wsSettings.headers)
            break
        }
        case 'http': {
            config_data.path = transport.httpSettings.path
            config_data.host = transport.httpSettings.host
            break
        }
        case 'quic': {
            config_data.acceptProxyProtocol = transport.quicSettings.acceptProxyProtocol
            config_data.password = transport.quicSettings.key
            config_data.masquerade = GetMasquerade(transport.quicSettings.header.type)
            break
        }
        case 'grpc': {
            config_data.service_name = transport.grpcSettings.serviceName
            break
        }
    }
}



function ProtocolJsonToConfig (json_config){
    const protocol_setting = JSON.parse(json_config.protocol_setting)
    switch (json_config.protocol){
        case "vmess":{
            config_data.disableInsecureEncryption = protocol_setting.disableInsecureEncryption
            config_data.uid = protocol_setting.clients[0].id
            break
        }
        case "vless":{
            config_data.uid = protocol_setting.clients[0].id
            break
        }
        case "trojan":{
            config_data.password = protocol_setting.clients[0].password
            break
        }
        case "shadowsocks": {
            config_data.shadowsocks_password = protocol_setting.password
            config_data.shadowsock_encryption = protocol_setting.method
            config_data.network = protocol_setting.network
            break
        }
        case "dokodemo-door": {
            config_data.destination_address = protocol_setting.address
            config_data.destination_port = protocol_setting.port
            config_data.network = protocol_setting.network
            break
        }
        case "socks":{
            if (protocol_setting.auth === "password"){
                config_data.username = protocol_setting.accounts[0].user
                config_data.password = protocol_setting.accounts[0].pass
                config_data.password_authentication = true
            }else{
                config_data.username = ""
                config_data.password = ""
                config_data.password_authentication = false
            }
            config_data.enable_udp = protocol_setting.udp
            break
        }
        case "http":{
            config_data.username = protocol_setting.accounts[0].user
            config_data.password = protocol_setting.accounts[0].pass
            config_data.password_authentication = true
            break
        }
    }
}

export const JsonToConfig = function (json_config,update=true) {
    config_data = JSON.parse(JSON.stringify(json_config))
    config_data.update = update
    const transport_setting = JSON.parse(json_config.transport)
    ProtocolJsonToConfig(json_config)
    TransportJsonToConfig(transport_setting)
    TlsXtlsJsonToConfig(json_config)
    return config_data
}
