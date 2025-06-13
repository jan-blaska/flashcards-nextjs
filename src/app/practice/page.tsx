"use client";


import Button from "@/components/Button";
import Card from "@/components/Card";
import { useState } from "react";

type CardDataProps = {
    frontSide?: string;
    backSide?: string;
};

export default function Practice() {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardsData, setCardsData] = useState<CardDataProps[]>([
        { frontSide: "Como estás?", backSide: "Jak se máš?" },
        { frontSide: "Buenos días", backSide: "Dobré ráno" },
        { frontSide: "Gracias", backSide: "Děkuji" },
        { frontSide: "Por favor", backSide: "Prosím" },
        { frontSide: "Adiós", backSide: "Sbohem" }
    ]);

    const handleNextCard = () => {
        if (currentCardIndex >= cardsData.length - 1) return;
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) => (prevIndex + 1));
    };

    const handlePreviousCard = () => {
        if (currentCardIndex <= 0) return;
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) => (prevIndex - 1));
    };

    const handleFlipCard = () => {
        setIsFlipped((prev) => !prev);
    };

    const handleRetry = () => {
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    const cardText = isFlipped ?
        cardsData[currentCardIndex].backSide :
        cardsData[currentCardIndex].frontSide;

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center">
            <h1 className="text-xl md:text-3xl pb-8">Flashcards</h1>
            <Card onClick={handleFlipCard} className="aspect-1/1 md:aspect-2/1 w-full" text={cardText} />
            <div className="flex flex-col md:flex-row justify-around w-full gap-4 pt-4 md:pt-8">
                <Button onClick={handlePreviousCard}>Previous</Button>
                <Button onClick={handleNextCard}>Next</Button>
            </div>
            {currentCardIndex === cardsData.length - 1 &&
                <Button color="purple" onClick={handleRetry} className="mt-4">
                    Retry
                </Button>}
        </div>
    );
}