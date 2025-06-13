<script lang="ts">
    import { walletStore } from "../../walletStore";
    import {
        SystemProgram,
        PublicKey,
        LAMPORTS_PER_SOL,
        TransactionMessage,
        clusterApiUrl,
        Connection,
        VersionedTransaction,
    } from "@solana/web3.js";
    const receiverAddress = "FDjn87xPsLiXwakFygi4uEdet568o7A22UboxrUCwu7A";

    let explorerUrl = "";

    async function simpleTransfer(amountInSol: number) {
        const lamports = amountInSol * LAMPORTS_PER_SOL;
        const transferToTestWalletIx = SystemProgram.transfer({
            lamports: lamports,
            // `fromPubkey` - from MUST sign the transaction
            fromPubkey: $walletStore.publicKey!,
            // `toPubkey` - does NOT have to sign the transaction
            toPubkey: new PublicKey(receiverAddress),
            programId: SystemProgram.programId,
        });

        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        let recentBlockhash = await connection
            .getLatestBlockhash()
            .then((res) => res.blockhash);

        // create a transaction message
        const message = new TransactionMessage({
            payerKey: $walletStore.publicKey!,
            recentBlockhash,
            instructions: [transferToTestWalletIx],
        }).compileToV0Message();

        const tx = new VersionedTransaction(message);

        // console.log("tx before signing:", tx);

        // sign the transaction with our needed Signers (e.g. `payer` and `keypair`)
        const sig = await $walletStore.adapter!.sendTransaction(tx, connection);

        explorerUrl = `https://explorer.solana.com/tx/${sig?.toString()}?cluster=devnet`;
    }
</script>

{#if $walletStore.connected}
    <div class="space-y-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
        <p class="text-gray-700">Click to transfer 0.1 SOL to <span class="font-mono text-sm">{receiverAddress}</span> on devnet</p>
        <button 
            onclick="{async () => await simpleTransfer(0.1)}"
            class="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium"
        >
            Transfer 0.1 SOL
        </button>
        {#if explorerUrl}
            <a 
                href="{explorerUrl}" 
                target="_blank"
                class="block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
                View on Solana Explorer
            </a>
        {/if}
    </div>
{:else}
    <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p class="text-gray-600">Please connect wallet first to do transfer!</p>
    </div>
{/if}
