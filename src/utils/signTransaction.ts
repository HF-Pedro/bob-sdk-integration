import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import { ecpairToSigner } from "./ecpairToSigner";
import * as ecc from 'tiny-secp256k1';

export async function signTransaction(psbtBase64: string, wif: string) {

    const psbt = bitcoin.Psbt.fromBase64(psbtBase64, { network: bitcoin.networks.testnet });


    const ECPair = ECPairFactory(ecc);
    const keyPair = ECPair.fromWIF(wif, bitcoin.networks.testnet);


    const signer = ecpairToSigner({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey!,
    });

    psbt.signAllInputs(signer);

    psbt.validateSignaturesOfAllInputs((publicKey, hash, signature) =>
        ecc.verify(hash, publicKey, signature)
    );

    psbt.finalizeAllInputs();

    const txHex = psbt.extractTransaction().toHex();
    console.log('Transação assinada em formato hexadecimal:', txHex);

    return txHex;
}