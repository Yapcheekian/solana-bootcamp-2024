import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Voting } from "../target/types/voting";
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require("../target/idl/voting.json");
const votingAddress = new PublicKey(
    "2BwhzY9pia4EBa2HjyFuTLGf34E4zsPzMuKKDirL2Wes",
);

describe("Voting", () => {
    let context;
    let provider;
    let votingProgram: Program<Voting>;

    beforeAll(async () => {
        //context = await startAnchor(
        //    "",
        //    [{ name: "voting", programId: votingAddress }],
        //    [],
        //);
        //provider = new BankrunProvider(context);
        //votingProgram = new Program<Voting>(IDL, provider);
    });

    it("initialize poll", async () => {
        await votingProgram.methods
            .initializePoll(
                new anchor.BN(1),
                "What is your favorite color?",
                new anchor.BN(0),
                new anchor.BN(1831162885),
            )
            .rpc();

        const [pollAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
            votingAddress,
        );

        const poll = await votingProgram.account.poll.fetch(pollAddress);

        expect(poll.pollId.toNumber()).toBe(1);
        expect(poll.description).toBe("What is your favorite color?");
        expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
    });

    it("initialize candidate", async () => {
        await votingProgram.methods
            .initializeCandidate("Smooth", new anchor.BN(1))
            .rpc();
        await votingProgram.methods
            .initializeCandidate("Crunchy", new anchor.BN(1))
            .rpc();

        const [crunchyAddress] = PublicKey.findProgramAddressSync(
            [
                new anchor.BN(1).toArrayLike(Buffer, "le", 8),
                Buffer.from("Crunchy"),
            ],
            votingAddress,
        );
        const crunchyCandidate =
            await votingProgram.account.candidate.fetch(crunchyAddress);

        expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);

        const [smoothAddress] = PublicKey.findProgramAddressSync(
            [
                new anchor.BN(1).toArrayLike(Buffer, "le", 8),
                Buffer.from("Smooth"),
            ],
            votingAddress,
        );
        const smoothCandidate =
            await votingProgram.account.candidate.fetch(smoothAddress);

        expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);
    });

    it("vote", async () => {
        await votingProgram.methods.vote("Smooth", new anchor.BN(1)).rpc();

        const [smoothAddress] = PublicKey.findProgramAddressSync(
            [
                new anchor.BN(1).toArrayLike(Buffer, "le", 8),
                Buffer.from("Smooth"),
            ],
            votingAddress,
        );
        const smoothCandidate =
            await votingProgram.account.candidate.fetch(smoothAddress);

        expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1);
    });
});