"use client";

import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { deleteCategory, getAllCategories } from "@/services/categoryService";
import { CategoryProps } from "@/types/category";


export default function Home() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [currentDeleteCategoryModal, setCurrentDeleteCategoryModal] = useState<CategoryProps | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {

      const userSession = sessionStorage.getItem("user");

      if (!user && !userSession) {
        router.push("/login");
      }

      if (!user) return;

      try {
        const stacks: CategoryProps[] = await getAllCategories({userId: user.uid});
        setCategories(stacks);
      } catch (error) {
        console.error("Error fetching card stacks:", error);
      }
    };

    fetchCategories();
  }, [user, router]);

  return (
    <div className="flex max-w-5xl w-[95%] mx-auto py-12 flex-col">
      {user && currentDeleteCategoryModal &&
          <Modal 
            onConfirm={async () => {
              await deleteCategory({userId: user.uid, categoryId: currentDeleteCategoryModal.id});
              setCategories(prev => prev.filter(category => category.id !== currentDeleteCategoryModal.id));
              setCurrentDeleteCategoryModal(null);
            }}  
            onClose={() => setCurrentDeleteCategoryModal(null)}
          >
            <p className="text-md">
              Are you sure you really want to delete the category "{currentDeleteCategoryModal.name}" ?
            </p>
          </Modal>
      }
      <h1 className="text-left text-(--green) text-3xl pb-4">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4">
        {categories.map((stack, index) => {
          return (
            <Card
              key={index}
              className="aspect-2/3"
              text={stack.name}
              href={{
                pathname: "/category",
                query: { categoryId: stack.id },
              }}
              editButtonHref={{
                pathname: "/edit-category",
                query: { categoryId: stack.id },
              }}
              onDeleteButtonClick={() => {
                setCurrentDeleteCategoryModal(stack);
              }}
            />
          );
        })}
        <Card
          className="aspect-2/3"
          isCreateCard={true}
          text="Create New Category"
          href={{
            pathname: "/create-category",
          }}
        />
      </div>
    </div>

  );
}
