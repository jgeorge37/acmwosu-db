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

export {encryptWithAES, decryptWithAES}