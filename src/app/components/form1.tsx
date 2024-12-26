"use client";

import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, PlusIcon } from "lucide-react";
import Avatar from "boring-avatars";

export default function Form1({ mnemonic }: { mnemonic: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [privateKeys, setPrivateKeys] = useState<string[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<boolean[]>([]);

  const addWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const privateKey = secret.slice(0, 32);
      const keypair = Keypair.fromSecretKey(secret);

      setPublicKeys((prev) => [...prev, keypair.publicKey.toBase58()]);
      setPrivateKeys((prev) => [
        ...prev,
        Buffer.from(privateKey).toString("hex"),
      ]);
      setCurrentIndex((prev) => prev + 1);
      setVisibleKeys((prev) => [...prev, false]);
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
  };

  useEffect(() => {
    addWallet();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleKeyVisibility = (index: number) => {
    const newVisibleKeys = [...visibleKeys];
    newVisibleKeys[index] = !newVisibleKeys[index];
    setVisibleKeys(newVisibleKeys);
  };

  return (
    <div className="flex flex-col border gap-4 sm:gap-5 justify-start items-start bg-black rounded-xl p-4 sm:p-6 w-full">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-5">
        <h2 className="text-2xl sm:text-3xl font-medium text-zinc-100">
          Solana Wallets
        </h2>
        <Button
          className="bg-zinc-900 w-fit hover:bg-zinc-700 text-zinc-100 sm:w-auto"
          onClick={addWallet}
        >
          <PlusIcon size={24} />
          <span className="ml-2 hidden sm:inline">Generate Wallet</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 w-full">
        {publicKeys.map((publicKey, index) => (
          <Card className="bg-black px-2 sm:px-3 shadow-lg" key={publicKey}>
            <CardHeader className="pb-1 sm:pb-2 px-1">
              <CardTitle className="flex items-center justify-start gap-2 sm:gap-3">
                <Avatar
                  name={publicKey}
                  size={32}
                  className="sm:w-10 sm:h-10"
                  variant="marble"
                  colors={[
                    "#A78BFA",
                    "#818CF8",
                    "#60A5FA",
                    "#34D399",
                    "#F472B6",
                  ]}
                />
                <p className="font-medium text-sm sm:text-base">
                  Wallet {index + 1}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-2 sm:mt-3 bg-zinc-900 my-1 rounded-xl py-3 sm:py-4 mb-2 sm:mb-3">
              <p className="text-lg sm:text-xl font-medium text-zinc-100 mb-1">
                Public Key
              </p>
              <p className="text-base sm:text-lg font-light text-zinc-400 break-all">
                {publicKey}
              </p>
              <div className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 font-medium text-zinc-100 mt-3 mb-1">
                Private Key
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-zinc-100 p-0"
                  onClick={() => toggleKeyVisibility(index)}
                  aria-label={
                    visibleKeys[index] ? "Hide private key" : "Show private key"
                  }
                >
                  {visibleKeys[index] ? (
                    <EyeOff size={16} className="sm:w-5 sm:h-5 inline" />
                  ) : (
                    <Eye size={16} className="sm:w-5 sm:h-5 inline" />
                  )}
                </Button>
              </div>
              <p className="text-base sm:text-lg font-light text-zinc-400 break-all">
                {visibleKeys[index] ? privateKeys[index] : "•".repeat(64)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
