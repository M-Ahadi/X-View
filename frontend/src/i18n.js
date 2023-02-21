import {createI18n } from 'vue-i18n'

function loadLocaleInfo () {
    const locales = require.context('./locales', true, /(^|\/)[A-Za-z0-9_,\s-]+\.json$/i)
    const messages = {}
    locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9_-]+)\./i)
        if (matched && matched.length > 1) {
            const locale = matched[1]
            messages[locale] = locales(key)
        }
    })
    return { id: locales.id, messages }
}

const { id, messages } = loadLocaleInfo()

const i18n = new createI18n ({
    locale: 'en',
    allowComposition: true,
    messages
})

if (module.hot) {
    module.hot.accept(id, () => {
        const { messages } = loadLocaleInfo()
        Object.keys(messages).forEach(locale => {
            i18n.setLocaleMessage(locale, messages[locale])
        })
    })
}

export default i18n