"use client";

import Card from "@/components/Card";
import Loading from "@/components/common/Loading";
import Modal from "@/components/Modal";
import { getCategoryById } from "@/services/categoryService";
import { deleteFlashcard, getAllFlashcards } from "@/services/flashcardService";
import { CategoryProps } from "@/types/category";
import { FlashcardProps } from "@/types/flashcard";
import { auth } from "@/utils/firebaseConfig";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Category() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const [flashcards, setFlashcards] = useState<FlashcardProps[]>([]);
    const [categoryName, setCategoryName] = useState<string>("Unknown category");
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDeleteFlashcardModal, setCurrentDeleteFlashcardModal] = useState<FlashcardProps | null>(null);

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
                    setFlashcards(shuffledCards);

                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching all the flashcards:", error);
            }
        };

        fetchCards();
    }, [categoryId, user]);
    
    if (isLoading) {
        return <Loading />;
    }
    
    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-12 flex-col">
            {user && categoryId && currentDeleteFlashcardModal &&
                <Modal 
                  onConfirm={async () => {
                    await deleteFlashcard({userId: user.uid, categoryId: categoryId, cardId: currentDeleteFlashcardModal.id ?? ""});
                    setFlashcards(prev => prev.filter(flashcard => flashcard.id !== currentDeleteFlashcardModal.id));
                    setCurrentDeleteFlashcardModal(null);
                  }}  
                  onClose={() => setCurrentDeleteFlashcardModal(null)}
                >
                  <p className="text-md">
                    Are you sure you really want to delete the card "{currentDeleteFlashcardModal.frontSide?.text ?? "unknown card"}" ?
                  </p>
                </Modal>
            }
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-left text-(--green) text-3xl">Category - {categoryName}</h1>
              <Link
                  href={{
                      pathname: "/practice",
                      query: { categoryId: categoryId },
                  }}
                  className="text-lg md:text-xl py-3 px-6 text-white rounded-xl cursor-pointer bg-blue-500 hover:bg-blue-600 text-center"
              >
                  Practice
              </Link>

            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4">
                    {flashcards.map((card, index) => {
                      return (
                        <Card
                          key={index}
                          className="aspect-2/3"
                          text={card.frontSide?.text}
                          secondaryText={card.frontSide?.secondaryText}
                          onClick={() => console.log("card clicked")}
                          editButtonHref={{
                            pathname: "/edit-card",
                            query: { categoryId: categoryId, flashcardId: card.id },
                          }}
                          onDeleteButtonClick={() => {
                            setCurrentDeleteFlashcardModal(card);
                          }}
                        />
                      );
                    })}
                    <Card
                      className="aspect-2/3"
                      isCreateCard={true}
                      text="Create New Card"
                      href={{
                        pathname: "/create-card",
                        query: { categoryId: categoryId },
                      }}
                    />
                  </div>
        </div>
    );
}