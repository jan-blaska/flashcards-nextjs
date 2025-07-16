"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebaseConfig";
import Button from "@/components/Button";
import { editCategory, getCategoryById } from "@/services/categoryService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryProps } from "@/types/category";
import { useRouter } from "next/navigation";


export default function EditCategoryPage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const [user] = useAuthState(auth);
    const [categoryName, setCategoryName] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchCategory = async () => {
          if (!user || !categoryId) return;
          try {
            const stack: CategoryProps | null = await getCategoryById({userId: user.uid, categoryId: categoryId});
            if (stack) setCategoryName(stack.name);
          } catch (error) {
            console.error("Error fetching card stacks:", error);
          }
        };
        fetchCategory();
      }, [user, categoryId]);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const newCategoryName = formData.get('new-category-name') as string | null;

        if (!newCategoryName || !categoryId) {
            console.error("Category name or category Id is missing");
            return;
        }

        try {
            await editCategory({
                userId: user.uid,
                categoryId: categoryId,
                updatedFields: {
                    name: newCategoryName
                }
            });
            router.push("/");
        } catch (error) {
            console.error("Error creating new category:", error);
        }
        form.reset();
    }

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)] justify-center items-center">
            <div className="flex flex-col items-center w-9/10 max-w-[400px] bg-black/5 dark:bg-white/10 p-8 rounded-2xl">
                <h1 className="text-2xl md:text-3xl text-(--green) pb-8">Edit category</h1>
                <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="new-category-name">Name:</label>
                        <input
                            type="text"
                            id="new-category-name"
                            name="new-category-name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <Button color="blue" type="submit">Save</Button>
                </form>
            </div>
        </div>
    )
}
