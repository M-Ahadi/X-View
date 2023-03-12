import axios from 'axios';

// axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API;

export const  GeneratePassword = function (passwordLength = 12) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    let randomNumber = 0
    for (let i = 0; i <= passwordLength; i++) {
        randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
    }
    return password
}

export const  RandomNumber = function () {
    return Math.floor(Math.random() * (65536 - 10000) + 10000);
}

export const  RandomPort = function () {
   return RandomNumber()
}

export const  uuidv4 = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


export const HTTP = axios.create({
    headers: {
        'Accept-Language': 'en-us',
    },
});

export const DOWNLOAD_HTTP = axios.create({
    // baseURL: process.env.VUE_APP_API,
    responseType: 'blob',
    headers: {
        'Accept-Language': 'en-us',
    }
});

export const UPLOAD_HTTP = axios.create({
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});
