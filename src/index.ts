import * as bitcoin from 'bitcoinjs-lib';
import {GatewaySDK, GatewayQuoteParams} from "@gobob/bob-sdk/dist/gateway"
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { ecpairToSigner } from './utils/ecpairToSigner';

const BOB_TBTC_TESTNET_TOKEN_ADDRESS = '0xc4229678b65e2D9384FDf96F2E5D512d6eeC0C77';
const testnet = bitcoin.networks.testnet;


export async function swapBtcForTokenTestnet(evmAddress: string) {
    const gatewaySDK = new GatewaySDK('testnet');

    const quoteParams: GatewayQuoteParams = {
        fromChain: 'Bitcoin',
        fromToken: 'BTC',
        fromUserAddress: 'tb1q4vwr574c8mx50ev9df8qyyle7xc490qqwntqww',
        toChain: 'bob-sepolia',
        toUserAddress: evmAddress,
        toToken: BOB_TBTC_TESTNET_TOKEN_ADDRESS,
        amount: 10000,
    };


    const quote = await gatewaySDK.getQuote(quoteParams);
    console.log('Cotação recebida:', quote);


    const response = await gatewaySDK.startOrder(quote, quoteParams);

    console.log(response)

    const uuid = response.uuid

    const psbtBase64 = response.psbtBase64

    
    const psbt = bitcoin.Psbt.fromBase64(psbtBase64!, { network: testnet });
    console.log('PSBT carregada:', psbt.toBase64());

    const ECPair = ECPairFactory(ecc);
    const keyPair = ECPair.fromWIF('KyEJKZM6EhMotPJ2QHWPUMYEKcFMTwYTTq21AxiaNSrbeQ2h1NVb', testnet);


    const signer = ecpairToSigner({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey!,
    });


    psbt.signAllInputs(signer);


    const areSignaturesValid = psbt.validateSignaturesOfAllInputs((publicKey, hash, signature) =>
        ecc.verify(hash, publicKey, signature)
    );
    if (!areSignaturesValid) {
        throw new Error('Assinaturas inválidas na PSBT');
    }

    psbt.finalizeAllInputs();


    const txHex = psbt.extractTransaction().toHex();
    console.log('Transação assinada em hexadecimal:', txHex);


    await gatewaySDK.finalizeOrder(uuid, txHex);
    console.log('Ordem finalizada com sucesso na Testnet!');
}

(async () => {
    const ethereumTestnetAddress = '0x8C60BB6818fCAaF832D660B60ED2dfBd103A38bE'; // Substitua com o seu endereço Ethereum Testnet
    await swapBtcForTokenTestnet(ethereumTestnetAddress);
})();