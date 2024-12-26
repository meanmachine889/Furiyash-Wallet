"use client";

import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, PlusIcon } from 'lucide-react';
import Avatar from "boring-avatars";

export default function EthereumWalletGenerator({
  mnemonic,
}: {
  mnemonic: string;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [privateKeys, setPrivateKeys] = useState<string[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<boolean[]>([]);

  const generateWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    setPrivateKeys([...privateKeys, privateKey]);
    const wallet = new Wallet(privateKey);
    setCurrentIndex(currentIndex + 1);
    setAddresses([...addresses, wallet.address]);
    setVisibleKeys([...visibleKeys, false]);
  };

  useEffect(() => {
    generateWallet();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleKeyVisibility = (index: number) => {
    const newVisibleKeys = [...visibleKeys];
    newVisibleKeys[index] = !newVisibleKeys[index];
    setVisibleKeys(newVisibleKeys);
  };

  return (
    <div className="flex flex-col border gap-5 justify-start items-start bg-black rounded-xl p-4 sm:p-6 w-full">
      <div className="w-full flex sm:flex-row flex-col sm:justify-between sm:items-center gap-5">
        <h2 className="text-2xl sm:text-3xl font-medium text-zinc-100">Ethereum Wallets</h2>
        <Button
          className="bg-zinc-900 w-fit hover:bg-zinc-700 text-zinc-100"
          onClick={generateWallet}
        >
          <PlusIcon size={24} />
          <span className="ml-2 hidden sm:inline">Generate Wallet</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        {addresses?.map((address, index) => (
          <Card className="bg-black px-2 sm:px-3 shadow-lg" key={address}>
            <CardHeader className="pb-1 sm:pb-2 px-1">
              <CardTitle className="flex items-center justify-start gap-3">
                <Avatar
                  name={address}
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
                <p className="font-medium text-sm sm:text-base">Wallet {index+1}</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-2 sm:mt-3 bg-zinc-900 my-1 rounded-xl py-3 sm:py-4 mb-2 sm:mb-3">
              <p className="text-lg sm:text-xl font-medium text-zinc-100 mb-1">Address</p>
              <p className="text-base sm:text-lg font-light text-zinc-400 break-all">
                {address}
              </p>
              <div className="text-lg sm:text-xl flex items-center gap-3 font-medium text-zinc-100 mt-3 mb-1">
                Private Key 
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-zinc-100 p-0"
                  onClick={() => toggleKeyVisibility(index)}
                >
                  {visibleKeys[index] ? (
                    <EyeOff size={16} className="sm:w-5 sm:h-5 inline" />
                  ) : (
                    <Eye size={16} className="sm:w-5 sm:h-5 inline" />
                  )}
                </Button>
              </div>
              <p className="text-base sm:text-lg font-light text-zinc-400 break-all">
                {visibleKeys[index] ? privateKeys[index] : '•'.repeat(64)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

