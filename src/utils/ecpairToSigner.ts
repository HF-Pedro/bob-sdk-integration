import { ECPairInterface } from 'ecpair'; // Interface para ECPair
import * as ecc from 'tiny-secp256k1';    // Implementação das funções de assinatura ECDSA
import * as bitcoin from 'bitcoinjs-lib';
import { Signer } from './types';

export function ecpairToSigner(keyPair: { publicKey: Uint8Array; privateKey: Uint8Array; }): bitcoin.Signer {
    return {
        publicKey: Buffer.from(keyPair.publicKey),
        sign: (hash: Buffer) => {
            if (!keyPair.privateKey) {
                throw new Error('Chave privada não encontrada no keyPair');
            }
            return Buffer.from(ecc.sign(hash, Buffer.from(keyPair.privateKey))); 
        },
    };
}