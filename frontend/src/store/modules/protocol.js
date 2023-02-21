import {GeneratePassword, RandomPort, uuidv4} from "@/store/utils";
import {ENCRYPTIONS, NETWORKS, PROTOCOLS, SHADOWSOCKS_ENRYPTIONS, TRANSMISSIONS,} from "@/store/constants";


let config_data = {}

export const  GetDefaultConfig = function () {
    return {
        update : false,
        id: null,
        password : GeneratePassword(),
        shadowsocks_password : GeneratePassword(),
        port : RandomPort(),
        uid : uuidv4(),
        protocol : PROTOCOLS[0],
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
        masquerade : '',
        mtu : 1350,
        tti : 20,
        uplink_capacity : 5,
        downlink_capacity : 20,
        congestion : false,
        read_buffer_size : 2,
        write_buffer_size : 2,
        path : '/',
        host : '',
        encryption : ENCRYPTIONS[0],
        shadowsocks_encryption : SHADOWSOCKS_ENRYPTIONS[0],
        service_name : '',
        request_version: "1.1",
        request_method: "GET",
        request_path: "/",
        response_version: "1.1",
        response_status: 200,
        response_status_description: "OK"

    }
}

function TlsXtlsJsonToConfig(json_config) {
    const transport = JSON.parse(json_config.transport)
    config_data.security = transport.security
    switch (transport.security) {
        case "tls": {
            config_data.tls = true
            config_data.serverName = transport.tlsSettings.serverName
            config_data.alpn = transport.tlsSettings.alpn
            break
        }
        case "xtls": {
            config_data.xtls = true
            // config_data.certificate = transport.xtlsSettings.certificates
            config_data.serverName = transport.xtlsSettings.serverName
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
            break
        }
        case 'ws': {
            config_data.acceptProxyProtocol = transport.wsSettings.acceptProxyProtocol
            config_data.path = transport.wsSettings.path
            break
        }
        default: {
            config_data.acceptProxyProtocol = transport.tcpSettings.acceptProxyProtocol
        }
        // case 'http':
        //     break
        // case 'quic':
        //     break
        // case 'grpc':
        //     break
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
            config_data.shadowsocks_encryption = protocol_setting.method
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
            if (protocol_setting.auth === "auth"){
                config_data.username = protocol_setting.user
                config_data.password = protocol_setting.pass
                config_data.password_authentication = true
            }else{
                config_data.username = ""
                config_data.password = ""
                config_data.password_authentication = false
            }
            config_data.enable_udp = protocol_setting.udp
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
