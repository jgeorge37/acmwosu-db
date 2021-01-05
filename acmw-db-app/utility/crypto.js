// back-end only
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

dotenv.config();

function encryptWithAES(text) {
    const passphrase = process.env.ENCRYPTION_PHRASE;
    return CryptoJS.AES.encrypt(text, passphrase).toString();
}

function decryptWithAES(encrypted) {
    const passphrase = process.env.ENCRYPTION_PHRASE;
    const bytes = CryptoJS.AES.decrypt(encrypted, passphrase);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
}

function base64enc(text) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

function base64dec(data) {
    return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
}

export {encryptWithAES, decryptWithAES, base64enc, base64dec}