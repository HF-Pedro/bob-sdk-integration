"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.swapBtcForTokenTestnet = void 0;
var bitcoin = __importStar(require("bitcoinjs-lib"));
var bob_sdk_1 = require("@gobob/bob-sdk");
var ecpair_1 = require("ecpair");
var ecc = __importStar(require("tiny-secp256k1"));
var ecpairToSigner_1 = require("./utils/ecpairToSigner");
var BOB_TBTC_TESTNET_TOKEN_ADDRESS = '0xc4229678b65e2D9384FDf96F2E5D512d6eeC0C77';
var testnet = bitcoin.networks.testnet;
function swapBtcForTokenTestnet(evmAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var gatewaySDK, quoteParams, quote, response, uuid, psbtBase64, psbt, ECPair, keyPair, signer, areSignaturesValid, txHex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gatewaySDK = new bob_sdk_1.GatewaySDK('testnet');
                    quoteParams = {
                        fromChain: 'Bitcoin',
                        fromToken: 'BTC',
                        fromUserAddress: 'tb1q4vwr574c8mx50ev9df8qyyle7xc490qqwntqww',
                        toChain: 'bob-sepolia',
                        toUserAddress: evmAddress,
                        toToken: BOB_TBTC_TESTNET_TOKEN_ADDRESS,
                        amount: 10000
                    };
                    return [4 /*yield*/, gatewaySDK.getQuote(quoteParams)];
                case 1:
                    quote = _a.sent();
                    console.log('Cotação recebida:', quote);
                    return [4 /*yield*/, gatewaySDK.startOrder(quote, quoteParams)];
                case 2:
                    response = _a.sent();
                    console.log(response);
                    uuid = response.uuid;
                    psbtBase64 = response.psbtBase64;
                    psbt = bitcoin.Psbt.fromBase64(psbtBase64, { network: testnet });
                    console.log('PSBT carregada:', psbt.toBase64());
                    ECPair = (0, ecpair_1.ECPairFactory)(ecc);
                    keyPair = ECPair.fromWIF('KyEJKZM6EhMotPJ2QHWPUMYEKcFMTwYTTq21AxiaNSrbeQ2h1NVb', testnet);
                    signer = (0, ecpairToSigner_1.ecpairToSigner)({
                        publicKey: keyPair.publicKey,
                        privateKey: keyPair.privateKey
                    });
                    psbt.signAllInputs(signer);
                    areSignaturesValid = psbt.validateSignaturesOfAllInputs(function (publicKey, hash, signature) {
                        return ecc.verify(hash, publicKey, signature);
                    });
                    if (!areSignaturesValid) {
                        throw new Error('Assinaturas inválidas na PSBT');
                    }
                    psbt.finalizeAllInputs();
                    txHex = psbt.extractTransaction().toHex();
                    console.log('Transação assinada em hexadecimal:', txHex);
                    return [4 /*yield*/, gatewaySDK.finalizeOrder(uuid, txHex)];
                case 3:
                    _a.sent();
                    console.log('Ordem finalizada com sucesso na Testnet!');
                    return [2 /*return*/];
            }
        });
    });
}
exports.swapBtcForTokenTestnet = swapBtcForTokenTestnet;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var ethereumTestnetAddress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ethereumTestnetAddress = '0x8C60BB6818fCAaF832D660B60ED2dfBd103A38bE';
                return [4 /*yield*/, swapBtcForTokenTestnet(ethereumTestnetAddress)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
