"use client";

import Card from "@/components/Card";
import { useEffect, useState } from "react";
import db from "@/utils/firestore";
import { collection, getDocs } from "firebase/firestore";

type CardStackProps = {
  name: string;
};

export default function Home() {
  const [cardStacks, setCardStacks] = useState<CardStackProps[]>([]);

  useEffect(() => {
    const fetchCardStacks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Flashcards"));
        console.log("querySnapshot.size:", querySnapshot.size)
        const stacks: CardStackProps[] = [];
        querySnapshot.forEach((doc) => {
          console.log("doc.id:", doc.id);
          console.log("doc.data():", doc.data());
          stacks.push({ name: doc.id } as CardStackProps);
        });
        setCardStacks(stacks);
      } catch (error) {
        console.error("Error fetching card stacks:", error);
      }
    };

    fetchCardStacks();
  }, []);

  return (
    <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center">
      <h1 className="text-xl md:text-3xl pb-8  text-green-500">Flashcards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4">
        {cardStacks.map((stack, index) => {
          return (
            <Card
              key={index}
              className="w-full aspect-2/3"
              text={stack.name}
              href={{
                pathname: "/practice",
                query: { category: encodeURIComponent(stack.name) },
              }}
            />
          );
        })}

      </div>
      {cardStacks.length === 0 && <span>No Card Stacks</span>}
    </div>
  );
}
