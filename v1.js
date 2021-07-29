/***
 * версия 1. текст внутри - какойто вид энтропии мнемоника
 */
const TEXT = ('1').repeat(32) // заменить на свой

const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const BlocksoftKeysUtils = require("./utils/BlocksoftKeysUtils");


const oneIsPrivate = (privateKey) => {
    const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey)
    const address = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey}).address
    console.log(`
    address:    ${address}
    privateKey: ${keyPair.toWIF()}
    `)
}

const oneIsSeed = (seed) => {
    const root = bip32.fromSeed(seed)
    const child = root.derivePath(`m/44'/0'/0'/0/0`)
    oneIsPrivate(child.privateKey)
}

const oneRandom = (random) => {
    const mnemonic = bip39.entropyToMnemonic(random)
    console.log(`
    mnemonic: ${mnemonic}
    `)
    const seed = BlocksoftKeysUtils.bip39MnemonicToSeed(mnemonic.toLowerCase())
    oneIsSeed(seed)
}

const testRandom = (random, title = 'try 1') => {

    // допустим это рендом от мнемоника
    try {
        oneRandom(random)
    } catch (e) {
        console.log(title + ' as mnemonic not ok')
    }

    // допустим это сид
    try {
        oneIsSeed(random)
    } catch (e) {
        console.log(title + ' as seed not ok')
    }

    // допустим это сразу приватник
    try {
        oneIsPrivate(random)
    } catch (e) {
        console.log(title + ' as private not ok')
    }
}

const main = async () => {

    try {
        const random = Buffer.from(TEXT)
        testRandom(random, 'try 1')
    } catch (e) {
        console.log('try 1 not ok')
    }

    try {
        const random = Buffer.from(TEXT, 'base64')
        testRandom(random, 'try 2')
    } catch (e) {
        console.log('try 2 not ok')
    }

    process.exit(1)
}

main()
