function GetDomain(inbound, config) {
    if (['xtls', 'tls'].find(member => member === inbound.transport.security)) {
        if (inbound.transport.security === "tls") {
            config += inbound.transport.tlsSettings.serverName + ":" + inbound.port + "?"
            config += "security=tls"
            config += "&".concat("sni=", inbound.transport.tlsSettings.alpn)
        }
        if (inbound.transport.security === "xtls") {
            config += inbound.transport.xtlsSettings.serverName + ":" + inbound.port + "?"
            config += "security=xtls"
            config += "&".concat("sni=", inbound.transport.xtlsSettings.alpn)
        }

    } else {
        config += window.location.hostname + ":" + inbound.port + "?"
        config += "security=none"
    }
    return config
}
function GetPath(inbound,original_path){
    let is_tls = inbound.transport.security === 'tls' || inbound.transport.security === 'xtls'
    if (inbound.behind_nginx) {
        return  original_path + "/" + inbound.port + (is_tls? "/s": "")
    }else{
        return original_path
    }
}

export const MakeConfigString = function (inbound) {
    inbound.protocol_setting = JSON.parse(inbound.protocol_setting)
    inbound.transport = JSON.parse(inbound.transport)

    let config = ""
    let server = ''
    let extra_configs = []
    let port
    if (inbound.behind_nginx){
        if (inbound.transport.security === 'tls' || inbound.transport.security === 'xtls'){
            port = window.location.port ? window.location.port : window.location.protocol === "https:" ? 443 : 80
        }else{
            port = process.env.VUE_APP_NGINX_PORT
        }
    }else {
        port = inbound.port
    }
    switch (inbound.protocol) {
        case 'vless':
            config = "vless://" + inbound.protocol_setting.clients[0].id + "@"
            config = GetDomain(inbound, config)
            if (inbound.transport.network === "ws") {
                config = config.concat("&".concat("path=", GetPath(inbound, inbound.transport.wsSettings.path).replace("/", "%2F")))
            }
            config = config.concat("&".concat("type=", inbound.transport.network))
            config += "#" + inbound.name
            break
        case "vmess":
            config = {"v": "2"}
            config['ps'] = inbound.name

            if (inbound.transport.security === "tls") {
                config['add'] = inbound.transport.tlsSettings.serverName
                config['tls'] = "tls"
            } else {
                config['add'] = window.location.hostname
                config['tls'] = ""
            }

            config['port'] = port
            config['path'] = GetPath(inbound,inbound.transport.wsSettings ? inbound.transport.wsSettings.path : "")

            config['id'] = inbound.protocol_setting.clients[0].id
            config['aid'] = 0
            config['net'] = inbound.transport.network
            config['type'] = "none"
            config['host'] = ""

            config = JSON.stringify(config)
            config = btoa(config)
            config = "vmess://" + config
            break
        case "shadowsocks":
            server = inbound.transport.tlsSettings ? inbound.transport.tlsSettings.serverName : window.location.hostname
            config = btoa(inbound.protocol_setting.method + ":" + inbound.protocol_setting.password).replaceAll("=","") + "@" + server + ":" + port
            extra_configs = [""]

            if (inbound.transport.network === "ws") {
                extra_configs.push("path="+ GetPath(inbound,inbound.transport.wsSettings.path))
            }else if (inbound.transport.network === "quic") {
                extra_configs.push("mode=quic")
                extra_configs.push("host=" + inbound.transport.quicSettings.host)
            }
            if (inbound.transport.security === "tls"){
                extra_configs.push("host="+ inbound.transport.tlsSettings.serverName)
                extra_configs.push("tls")
            }
            if (extra_configs.length > 1){
                config += "/?plugin=v2ray-plugin"
            }
            config += encodeURIComponent(extra_configs.join(";"))
            config = "ss://" + config + "#" + inbound.name
            break
        case "trojan":
            config = "?type=" + inbound.transport.network
            if (inbound.transport.security === "tls"){
                config += "&security="+ inbound.transport.security
                config += "&alpn="+ inbound.transport.tlsSettings.alpn.replaceAll(",","%2C")
                config += "&host="+ inbound.transport.tlsSettings.serverName
            }
            if (inbound.transport.security === "xtls"){
                config += "&security="+ inbound.transport.security
                config += "&alpn="+ inbound.transport.xtlsSettings.alpn.replaceAll(",","%2C")
                config += "&host="+ inbound.transport.xtlsSettings.serverName
            }
            if (inbound.transport.network === "ws"){
                config += "&path="+ GetPath(inbound, inbound.transport.wsSettings.path).replace("/", "%2F")
            }
            if (inbound.transport.network === "http"){
                config += "&host="+ inbound.transport.httpSettings.host
                config += "&path="+ GetPath(inbound, inbound.transport.httpSettings.path).replace("/", "%2F")
            }
            if (inbound.transport.network === "grpc"){
                config += "&path="+ GetPath(inbound, inbound.transport.grpcSettings.serviceName).replace("/", "%2F")
            }

            server = inbound.transport.tlsSettings ? inbound.transport.tlsSettings.serverName : inbound.transport.xtlsSettings ? inbound.transport.xtlsSettings.serverName : window.location.hostname
            config = "trojan://" + inbound.protocol_setting.clients[0].password + "@" + server + ":" + port + config + "#" + inbound.name
            break
    }
    return config
}
