import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    generateSigner,
    keypairIdentity,
    percentAmount,
} from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();

await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL,
);

console.log("loaded user: ", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

const collectionMint = generateSigner(umi);

const transaction = createNft(umi, {
    mint: collectionMint,
    name: "My NFT Collection",
    symbol: "MNC",
    uri: "https://...",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
});

await transaction.sendAndConfirm(umi);

const createdCollectionMint = await fetchDigitalAsset(
    umi,
    collectionMint.publicKey,
);

console.log(
    `Collection created: ${getExplorerLink("address", createdCollectionMint.mint.publicKey, "devnet")}`,
);
