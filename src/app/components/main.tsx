"use client";

import { Pizza, Trash } from "lucide-react";
import Form from ".././components/form";
import Form1 from ".././components/form1";
import Mnemonics from ".././components/mnemonics";
import { generateMnemonic } from "bip39";
import {  useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Main() {
  const { toast } = useToast();
  const [mnemonic, setMnemonic] = useState<string>(localStorage.getItem("mnemonic") || "");
  const [dummy, setDummy] = useState<string>("");

  function setMnemonicHandler() {
    const trimmedDummy = dummy.trim().replace(/\s+/g, " ");
    if (
      trimmedDummy.split(" ").length === 12 ||
      trimmedDummy.split(" ").length === 24
    ) {
      if (typeof window !== "undefined") {
        localStorage.setItem("mnemonic", trimmedDummy);
      }
      setMnemonic(trimmedDummy);
    } else if (trimmedDummy === "") {
      const newMnemonic = generateMnemonic();
      if (typeof window !== "undefined") {
        localStorage.setItem("mnemonic", newMnemonic);
      }
      setMnemonic(newMnemonic);
    } else {
      toast({
        description: "Invalid Seed Phrase",
        type: "foreground",
        duration: 3000,
      });
    }
  }

  function handleDeleteWallet() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mnemonic");
    }
    setMnemonic("");
    setDummy("");
  }

  return (
    <div className="w-[100%] h-[100vh] gap-3 p-5 flex flex-col justify-start">
      <div className="w-[100%] flex justify-between items-center">
        <div className="flex justify-start mb-7 my-5 items-center gap-3 w-[100%]">
          <Pizza size={30} />
          <p className="text-2xl font-semibold">furiyash</p>
        </div>
        {mnemonic && (
          <Button
            className="bg-red-400 w-fit text-base hover:bg-red-300"
            onClick={handleDeleteWallet}
          >
            <p className="sm:block hidden">Delete Wallet</p>
            <Trash size={20} />
          </Button>
        )}
      </div>
      {mnemonic && (
        <>
          <Mnemonics mnemonic={mnemonic} />
          <div className="w-[100%] flex-1 flex-col flex gap-5 py-3">
            <Form mnemonic={mnemonic} />
            <Form1 mnemonic={mnemonic} />
          </div>
        </>
      )}

      {!mnemonic && (
        <div className="flex flex-col gap-4 sm:gap-5 mt-4 sm:mt-7 text-gray-300">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Enter a seed phrase
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Make sure it&apos;s a 12-word phrase or just click generate to get a random one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <Input
              className="w-full sm:w-[60%] py-4 sm:py-6 rounded-xl"
              type="password"
              placeholder="Enter seed phrase"
              value={dummy}
              onChange={(e) => setDummy(e.target.value)}
              aria-label="Seed phrase input"
            />
            <Button
              onClick={setMnemonicHandler}
              className="bg-zinc-900 text-gray-300 h-12 hover:bg-zinc-800 w-full sm:w-auto"
            >
              Generate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
