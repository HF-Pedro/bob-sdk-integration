export type Signer = {
    publicKey: Buffer;
    sign: (hash: Buffer) => Promise<Buffer> | Buffer;
};