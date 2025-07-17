"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebaseConfig";
import Loading from "@/components/common/Loading";
import { FlashcardProps } from "@/types/flashcard";
import { CategoryProps } from "@/types/category";
import { getCategoryById } from "@/services/categoryService";
import { getAllFlashcards } from "@/services/flashcardService";

export default function PracticePage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardsData, setCardsData] = useState<FlashcardProps[]>([]);
    const [user] = useAuthState(auth);
    const [categoryName, setCategoryName] = useState<string>("Unknown category");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            if (!user) {
                console.error("User is not authenticated.");
                return;
            }

            if (!categoryId) {
                console.error("CategoryId is unknown.");
                return;
            }

            try {
                const category: CategoryProps | null = await getCategoryById({userId: user.uid, categoryId: categoryId});
                if (category) setCategoryName(category.name);

                const flashcards: FlashcardProps[] | null = await getAllFlashcards({userId: user.uid, categoryId: categoryId});
                if (flashcards) {
                    const shuffledCards = flashcards.sort(() => Math.random() - 0.5);
                    setCardsData(shuffledCards);

                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching all the flashcards:", error);
            }
        };

        fetchCards();
    }, [categoryId, user]);

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

    if (isLoading) {
        return <Loading />;
    }

    if (cardsData.length === 0) {
        return (
            <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col items-center">
                    <h1 className="text-md md:text-xl">category</h1>
                    <h2 className="text-xl md:text-3xl pb-8 text-center text-green-500">{categoryName}</h2>
                </div>
                <div className="flex flex-col flex-grow items-center justify-center w-full">
                    <div className="text-lg md:text-xl flex flex-col items-center">
                        <span>There are no cards in this category yet.</span>
                        <span>Please add some cards.</span>
                    </div>
                    <Link
                        href={{
                            pathname: "/create-card",
                            query: { categoryId: categoryId },
                        }}
                        className="mt-4 py-4 w-1/2 md:w-1/4 text-white text-lg md:text-xl rounded-xl cursor-pointer bg-green-500 hover:bg-green-600 text-center"
                    >
                        Add First Card
                    </Link>
                </div>
            </div>
        );
    }

    const cardText = isFlipped ?
        cardsData[currentCardIndex].backSide?.text :
        cardsData[currentCardIndex].frontSide?.text;

    const cardSecondaryText = isFlipped ?
        cardsData[currentCardIndex].backSide?.secondaryText :
        cardsData[currentCardIndex].frontSide?.secondaryText;

    return (
        <div className="flex max-w-2xl w-[95%] mx-auto py-4 md:py-8 flex-col items-center min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)]">
            <h1 className="text-md md:text-xl">category</h1>
            <h2 className="text-xl md:text-3xl pb-4 md:pb-8 text-center text-green-500">{categoryName}</h2>
            <Card onClick={handleFlipCard} className="flex-grow w-full" text={cardText} secondaryText={cardSecondaryText} />
            <div className="flex flex-row justify-around w-full gap-2 md:gap-4 pt-4 md:pt-8">
                <Button onClick={handlePreviousCard}>Previous</Button>
                <Button onClick={handleNextCard}>Next</Button>
            </div>
            {currentCardIndex === cardsData.length - 1 &&
                <Button color="purple" onClick={handleRetry} className="mt-2 md:mt-4">
                    Retry
                </Button>}
        </div>
    );
}