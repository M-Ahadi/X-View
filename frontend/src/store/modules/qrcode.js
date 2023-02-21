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

export const MakeConfigString = function (inbound) {
    inbound.protocol_setting = JSON.parse(inbound.protocol_setting)
    inbound.transport = JSON.parse(inbound.transport)

    let config = ""
    let server = ''
    switch (inbound.protocol) {
        case 'vless':
            config = "vless://" + inbound.protocol_setting.clients[0].id + "@"
            config = GetDomain(inbound, config)
            if (inbound.transport.network === "ws") {
                config = config.concat("&".concat("path=", inbound.transport.wsSettings.path.replace("/", "%2F")))
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
            config['port'] = inbound.port
            config['id'] = inbound.protocol_setting.clients[0].id
            config['aid'] = 0
            config['net'] = inbound.transport.network
            config['type'] = "none"
            config['host'] = ""
            config['path'] = (inbound.transport.wsSettings) ? inbound.transport.wsSettings.path : ""
            config = JSON.stringify(config)
            config = btoa(config)
            config = "vmess://" + config
            break
        case "shadowsocks":
            server = inbound.transport.tlsSettings.serverName || window.location.hostname
            config = inbound.protocol_setting.method + ":" + inbound.protocol_setting.password + "@" + server + ":" + inbound.port
            config = btoa(config)
            config = "ss://" + config + "#" + inbound.name
            break
        case "trojan":
            server = inbound.transport.tlsSettings.serverName || inbound.transport.xtlsSettings.serverName || window.location.hostname
            config = "trojan://" + inbound.protocol_setting.password + "@" + server + ":" + inbound.port + "#" + inbound.name
            break
    }
    return config
}
