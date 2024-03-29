export const INBOUND = {
    GET_INBOUND: 'get_inbound',
    LIST_INBOUNDS: 'list_inbounds',
    UPDATE_INBOUND: 'update_inbound',
    UPDATE_STATUS: 'update_status',
    DELETE_INBOUND: 'delete_inbound',
    ADD_INBOUND: 'add_inbound',
    ERROR: 'error',
    GET_PASSWORD: "get_password"
}

export const CERTIFICATE = {
    LIST_CERTIFICATE: "list_certificate",
    DELETE_CERTIFICATE: "delete_certificate",
    ADD_CERTIFICATE: "add_certificate",
    UPDATE_CERTIFICATE: "update_certificate",
    ERROR: "error"
}

export const PROTOCOL_RENDER = {
    GET_DEFAULT_CONFIG: 'get_default_config',
    CONFIG_TO_JSON: 'config_to_json',
    JSON_TO_CONFIG: 'json_to_config',
}

export const USER = {
    LOGIN: "login",
    LOGOUT: "logout",
    CHANGE_PASSWORD: "change_password",
    REFRESH_TOKEN: "refresh_token",
    SET_TOKEN: "set_token",
    ERROR: "error"
}

export const SETTINGS = {
    UPDATE_TELEGRAM: "update_telegram",
    UPDATE_CAPTCHA: "update_captcha",
    LOAD_TELEGRAM: "load_telegram",
    LOAD_CAPTCHA: "load_captcha",
    LOAD_SITE_KEY: "load_site_key",
    LOAD_NGINX: "load_nginx",
    UPDATE_NGINX: "update_nginx",
    ERROR: "error"
}
export const SHADOWSOCKS_TRANSMISSIONS = [
    'tcp',
    'ws',
    'quic',
]

export const TRANSMISSIONS = [
    'tcp',
    'kcp',
    'ws',
    'http',
    'quic',
    'grpc'
]
export const NETWORKS = [
    "tcp,udp",
    "tcp",
    "udp"
]

export const  SHADOWSOCKS_ENRYPTIONS = [
    'aes-128-gcm',
    'aes-256-gcm',
    'chacha20-poly1305',
    'xchacha20-poly1305',
    '2022-blake3-aes-128-gcm',
    '2022-blake3-aes-256-gcm',
    '2022-blake3-chacha20-poly1305',
]

export const QUIC_ENCRYPTIONS = [
    'none',
    'aes-128-gcm',
    'chacha20-poly1305'
]

export const PROTOCOLS = [
    'vmess',
    'vless',
    'trojan',
    'shadowsocks',
    'dokodemo-door',
    'socks',
    'http',
]

export const MASQUERADES = [
    {name: 'None (not masquerade)', value: "none"},
    {name: 'srtp (masquerade video call)', value: "srtp"},
    {name: 'udp (masquerade BT download)', value: "utp"},
    {name: 'wechat-video (masquerade WeChat Video call)', value: "wechat-video"},
    {name: 'dtls (masquerade DTLS 1.2 packages)', value: "dtls"},
    {name: 'wireguard（masquerade wireguard packages)', value: "wireguard"},
]

export const FLOWS = [
    "xtls-rprx-origin",
    "xtls-rprx-direct",
    "xtls-rprx-splice",
    "xtls-rprx-vision"
]