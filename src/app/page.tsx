"use client";

import Card from "@/components/Card";
import { Span } from "next/dist/trace";
import { type } from "os";
import { useState } from "react";

type CardStackProps = {
  name: string;
};

export default function Home() {
  const [currentCardStackIndex, setCurrentCardStackIndex] = useState(0);
  const [cardStacks, setCardStacks] = useState<CardStackProps[]>([{ name: "Německá slovíčka" }]);

  const cardText = cardStacks[currentCardStackIndex];

  return (
    <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center">
      <h1 className="text-xl md:text-3xl pb-8">Flashcards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4">
        {cardStacks.map((stack, index) => {
          return (
            <Card
              key={index}
              className="w-full aspect-2/3"
              text={stack.name}
              href="/practice"
            />
          );
        })}

      </div>
      {cardStacks.length === 0 && <span>No Card Stacks</span>}
    </div>
  );
}
