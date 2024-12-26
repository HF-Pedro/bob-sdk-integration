import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory, ECPairInterface } from 'ecpair';
import axios from 'axios';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer'; // Importação necessária para converter Uint8Array para Buffer

// Configuração para a Testnet
const testnet = bitcoin.networks.testnet;

// Inicializar o ECPair usando tiny-secp256k1 como backend de assinatura
const ECPair = ECPairFactory(ecc);

/**
 * Gera um endereço Bitcoin Testnet
 * @returns O endereço Testnet gerado
 */
function generateTestnetAddress(): { address: string; privateKey: string; } {
    // Gera o par de chaves aleatório
    const keyPair: ECPairInterface = ECPair.makeRandom();

    // Converte a chave pública para Buffer (se necessário)
    const pubkey = Buffer.from(keyPair.publicKey);

    // Cria o endereço SegWit (Bech32)
    const { address } = bitcoin.payments.p2wpkh({
        pubkey,
        network: testnet,
    });

    if (!address) {
        throw new Error("Erro ao gerar o endereço.");
    }

    // Obtém a chave privada no formato WIF (Wallet Import Format)
    const privateKey = keyPair.toWIF();

    return { address, privateKey };
}

/**
 * Solicita BTC Testnet de um faucet
 * @param address O endereço Bitcoin Testnet para receber fundos
 */
async function requestTestnetBTC(address: string): Promise<void> {
    const faucetUrl = 'https://testnet-faucet.mempool.co/api/v1/request';

    try {
        const response = await axios.post(faucetUrl, { address });
        console.log("BTC Testnet solicitado com sucesso:");
        console.log(response.data);
    } catch (error: any) {
        console.error("Erro ao solicitar BTC Testnet:", error.response?.data || error.message);
    }
}

// Função principal
(async () => {
    try {
        // Gera o endereço Testnet
        const { address, privateKey } = generateTestnetAddress();
        console.log("Endereço Testnet gerado:", address);
        console.log("Chave privada (WIF):", privateKey);

        // Solicita BTC para o endereço gerado
        await requestTestnetBTC(address);
    } catch (error) {
        console.error("Erro:");
    }
})();
