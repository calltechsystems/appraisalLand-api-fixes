import CryptoJS from "crypto-js";

export const encryptionData = (payload)=>{
    const encryptionKey = process.env.CRYPTO_SECRET_KEY;
    console.log("fchgvjbknm");
    return {data :CryptoJS.AES.encrypt(JSON.stringify(payload), encryptionKey).toString()};
}