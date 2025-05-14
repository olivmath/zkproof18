"use client";
import React, { useState } from "react";
import { generateProof } from "../services/generateProof";


export function BirthdayForm() {
  const [birthdate, setBirthdate] = useState("1997-04-30");

  const handleClick = async () => {
    const year = new Date(birthdate).getFullYear();
    await generateProof(year);
  };

  return (
    <div className="text-center">
      <h1 className="mb-8 font-mono text-4xl font-bold tracking-tight text-foreground/80 sm:text-6xl md:text-7xl">
        🎉 Birthdate
        <br />{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Proof!
        </span>
      </h1>

      <div className="flex flex-col items-center gap-4">
        <label className="text-foreground/80 mb-0.5 block">
          input your birthdate
        </label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
        />
        <button
          onClick={handleClick}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Generate Proof
        </button>
      </div>
    </div>
  );
}
