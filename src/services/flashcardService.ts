import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import db from "@/utils/firestore";
import { FlashcardProps } from "@/types/flashcard";

type CreateFlashcardParams = {
  userId: string;
  categoryId: string;
  flashcard: FlashcardProps;
};

type GetAllFlashcardsParams = {
  userId: string;
  categoryId: string;
};

type GetFlashcardByIdParams = {
  userId: string;
  categoryId: string;
  cardId: string;
};

type UpdateFlashcardParams = {
  userId: string;
  categoryId: string;
  cardId: string;
  updatedFlashcard: FlashcardProps;
};

type DeleteFlashcardParams = {
  userId: string;
  categoryId: string;
  cardId: string;
};

export const createFlashcard = async ({ userId, categoryId, flashcard }: CreateFlashcardParams) => {
    const cardsRef = collection(db, "users", userId, "categories", categoryId, "cards");
    const flashcardToSave = {
        frontSide: flashcard.frontSide,
        backSide: flashcard.backSide,
        createdAt: serverTimestamp(),
    };
    await addDoc(cardsRef, flashcardToSave);
};

export const getAllFlashcards = async ({ userId, categoryId }: GetAllFlashcardsParams): Promise<FlashcardProps[]> => {
    const querySnapshot = await getDocs(collection(db, "users", userId, "categories", categoryId, "cards"));
    const flashcards: FlashcardProps[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FlashcardProps;
      flashcards.push({
        ...data,
        id: doc.id,
      });
    });
    return flashcards;
};

export const getFlashcardById = async ({ userId, categoryId, cardId }: GetFlashcardByIdParams): Promise<FlashcardProps | null> => {
  const cardRef = doc(db, "users", userId, "categories", categoryId, "cards", cardId);
  const cardSnap = await getDoc(cardRef);
  
  if (!cardSnap.exists()) {
    return null;
  }
  
  const data = cardSnap.data() as FlashcardProps;
  return {
    ...data,
    id: cardSnap.id,
  };
};

export const updateFlashcard = async ({ userId, categoryId, cardId, updatedFlashcard }: UpdateFlashcardParams) => {
  const cardRef = doc(db, "users", userId, "categories", categoryId, "cards", cardId);
  await updateDoc(cardRef, {
    frontSide: updatedFlashcard.frontSide,
    backSide: updatedFlashcard.backSide,
    updatedAt: serverTimestamp(),
  });
};

export const deleteFlashcard = async ({ userId, categoryId, cardId }: DeleteFlashcardParams) => {
  const cardRef = doc(db, "users", userId, "categories", categoryId, "cards", cardId);
  await deleteDoc(cardRef);
};