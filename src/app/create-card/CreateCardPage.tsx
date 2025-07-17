"use client";

import { useSearchParams } from "next/navigation";
import { auth } from "@/utils/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Loading from "@/components/common/Loading";
import Button from "@/components/Button";
import { CategoryProps } from "@/types/category";
import { getCategoryById } from "@/services/categoryService";
import { createFlashcard } from "@/services/flashcardService";
import { FlashcardProps } from "@/types/flashcard";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

export default function CreateCardPage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const [user] = useAuthState(auth);
    const [categoryName, setCategoryName] = useState<string>("Unknown category");
    const [isLoading, setIsLoading] = useState(true);

    const schema = z.object({
        frontSideText: z.string().min(1, "Front Side is required"),
        frontSideSecondaryText: z.string().optional(),
        backSideText: z.string().min(1, "Back Side is required"),
        backSideSecondaryText: z.string().optional(),
    });

    type FormData = z.infer<typeof schema>;

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user) {
            console.error("User is not authenticated.");
            return;
        }
        if (!categoryId) {
            console.error("CategoryId is unknown.");
            return;
        }
        const flashcard: FlashcardProps = {
            frontSide: {
                text: data.frontSideText,
                secondaryText: data.frontSideSecondaryText?.trim(),
            },
            backSide: {
                text: data.backSideText,
                secondaryText: data.backSideSecondaryText?.trim(),
            },
        };
        try {            
            await createFlashcard({
                userId: user.uid,
                categoryId: categoryId,
                flashcard,
            });
            toast.success("Card has been created!");
            reset();
        } catch (error) {
            console.error("Error creating flashcard:", error);
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        const fetchCategoryName = async () => {
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
            } catch (error) {
                console.error("Error fetching category name:", error);
            }
            setIsLoading(false);
        };

        fetchCategoryName();
    }, [user, categoryId]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)] justify-center items-center">
            <h2 className="text-lg md:text-xl text-center">{categoryName}</h2>
            <h1 className="text-2xl md:text-3xl text-(--green) pb-8">Create new card</h1>
            <form className="flex flex-col gap-4 w-full md:w-1/2" onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 bg-black/5 dark:bg-white/10 rounded-2xl">
                    <h3 className="text-xl pb-2">Front Side</h3>
                    <div className="flex flex-col">
                        <label htmlFor="front-side-text">Text:</label>
                        <input
                            {...register('frontSideText')}
                            type="text"
                            id="front-side-text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.frontSideText && <p className="text-red-500">{errors.frontSideText.message}</p>}
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="front-side-secondary-text">Secondary Text:</label>
                        <input
                            {...register('frontSideSecondaryText')}
                            type="text"
                            id="front-side-secondary-text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.frontSideSecondaryText && <p className="text-red-500">{errors.frontSideSecondaryText.message}</p>}
                    </div>
                </div>
                <div className="p-6 bg-black/5 dark:bg-white/10 rounded-2xl">
                    <h3 className="text-xl pb-2">Back Side</h3>
                    <div className="flex flex-col">
                        <label htmlFor="back-side-text">Text:</label>
                        <input
                            {...register('backSideText')}
                            type="text"
                            id="back-side-text"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    {errors.backSideText && <p className="text-red-500">{errors.backSideText.message}</p>}
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="back-side-secondary-text">Secondary Text:</label>
                    <input
                        {...register('backSideSecondaryText')}
                        type="text"
                        id="back-side-secondary-text"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.backSideSecondaryText && <p className="text-red-500">{errors.backSideSecondaryText.message}</p>}
                    </div>
                </div>
                <Button className="mt-2" color="blue" type="submit">{isSubmitting ? "Loading..." : "Create Card"}</Button>
            </form>
        </div>
    )
}
