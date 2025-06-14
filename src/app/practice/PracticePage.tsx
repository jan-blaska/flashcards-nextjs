"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import db from "@/utils/firestore";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebaseConfig";
import Loading from "@/components/common/Loading";

type CardDataProps = {
    frontSide?: string;
    backSide?: string;
};

export default function PracticePage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardsData, setCardsData] = useState<CardDataProps[]>([]);
    const [user] = useAuthState(auth);
    const [categoryName, setCategoryName] = useState<string>("Unknown category");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            if (!user || !categoryId) {
                console.error("User is not authenticated");
                return;
            }

            try {
                const categoryRef = doc(db, "users", user.uid, "categories", categoryId);
                const categorySnapshot = await getDoc(categoryRef);

                if (categorySnapshot.exists()) {
                    const data = categorySnapshot.data();
                    setCategoryName(data.name);
                }

                const querySnapshot = await getDocs(collection(db, "users", user.uid, "categories", categoryId, "cards"));
                const fetchedCards: CardDataProps[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedCards.push(doc.data() as CardDataProps);
                });
                const shuffledCards = fetchedCards.sort(() => Math.random() - 0.5);
                setCardsData(shuffledCards);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching cards:", error);
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
            <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center">
                <Link href="/">
                    <h1 className="text-md md:text-xl">Flashcards</h1>
                </Link>
                <h2 className="text-xl md:text-3xl pb-8 text-center text-green-500">{categoryName}</h2>
                <span>No cards available. Please create some cards.</span>
                <Link
                    href={{
                        pathname: "/create-card",
                        query: { categoryId: categoryId },
                    }}
                    className="mt-2 md:mt-4 py-4 w-full md:w-1/2 text-white rounded-xl cursor-pointer bg-green-500 hover:bg-green-600 text-center"
                >
                    Create
                </Link>
            </div>
        );
    }

    const cardText = isFlipped ?
        cardsData[currentCardIndex].backSide :
        cardsData[currentCardIndex].frontSide;

    return (
        <div className="flex max-w-2xl w-[95%] mx-auto py-4 md:py-8 flex-col items-center min-h-screen">
            <Link href="/">
                <h1 className="text-md md:text-xl">Flashcards</h1>
            </Link>
            <h2 className="text-xl md:text-3xl pb-4 md:pb-8 text-center text-green-500">{categoryName}</h2>
            <Card onClick={handleFlipCard} className="flex flex-grow w-full" text={cardText} />
            <div className="flex flex-row justify-around w-full gap-2 md:gap-4 pt-4 md:pt-8">
                <Button onClick={handlePreviousCard}>Previous</Button>
                <Button onClick={handleNextCard}>Next</Button>
            </div>
            <Link
                href={{
                    pathname: "/create-card",
                    query: { categoryId: categoryId },
                }}
                className="mt-2 md:mt-4 py-4 w-full text-white rounded-xl cursor-pointer bg-green-500 hover:bg-green-600 text-center"
            >
                Create
            </Link>
            {currentCardIndex === cardsData.length - 1 &&
                <Button color="purple" onClick={handleRetry} className="mt-2 md:mt-4">
                    Retry
                </Button>}
        </div>
    );
}