"use client";


import Button from "@/components/Button";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import db from "@/utils/firestore";
import { collection, getDocs } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type CardDataProps = {
    frontSide?: string;
    backSide?: string;
};

export default function Practice() {
    const searchParams = useSearchParams();
    const rawCategory = searchParams.get("category");
    const category = rawCategory ? decodeURIComponent(rawCategory) : "Neznámá kategorie";
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardsData, setCardsData] = useState<CardDataProps[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Flashcards", category, "cards"));
                const fetchedCards: CardDataProps[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedCards.push(doc.data() as CardDataProps);
                });
                const shuffledCards = fetchedCards.sort(() => Math.random() - 0.5);
                setCardsData(shuffledCards);
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
        };

        fetchCards();
    }, []);

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
        const shuffled = [...cardsData].sort(() => Math.random() - 0.5);
        setCardsData(shuffled);
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    if (cardsData.length === 0) {
        return (
            <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center">
                <Link href="/">
                    <h1 className="text-md md:text-xl">Flashcards</h1>
                </Link>
                <h2 className="text-xl md:text-3xl pb-8 text-center text-green-500">{category}</h2>
                <span>No cards available. Please create some cards.</span>
            </div>
        );
    }

    const cardText = isFlipped ?
        cardsData[currentCardIndex].backSide :
        cardsData[currentCardIndex].frontSide;

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center">
            <Link href="/">
                <h1 className="text-md md:text-xl">Flashcards</h1>
            </Link>
            <h2 className="text-xl md:text-3xl pb-8 text-center text-green-500">{category}</h2>
            <Card onClick={handleFlipCard} className="aspect-1/1 md:aspect-2/1 w-full" text={cardText} />
            <div className="flex flex-col md:flex-row justify-around w-full gap-4 pt-4 md:pt-8">
                <Button onClick={handlePreviousCard}>Previous</Button>
                <Button onClick={handleNextCard}>Next</Button>
            </div>
            <Link
                href={{
                    pathname: "/create-card",
                    query: { category: encodeURIComponent(category) },
                }}
                className="mt-4 py-4 w-full text-white rounded-xl cursor-pointer bg-green-500 hover:bg-green-600 text-center"
            >
                Create
            </Link>
            {currentCardIndex === cardsData.length - 1 &&
                <Button color="purple" onClick={handleRetry} className="mt-4">
                    Retry
                </Button>}
        </div>
    );
}