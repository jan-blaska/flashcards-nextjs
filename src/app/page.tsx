"use client";

import Card from "@/components/Card";
import { useEffect, useState } from "react";
import db from "@/utils/firestore";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";


type CategoryProps = {
  id: string;
  name: string;
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const userSession = sessionStorage.getItem("user");

    if (!user && !userSession) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCategories = async () => {

      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "categories"));
        console.log("querySnapshot.size:", querySnapshot.size)
        const stacks: CategoryProps[] = [];
        querySnapshot.forEach((doc) => {
          console.log("doc.id:", doc.id);
          console.log("doc.data():", doc.data());
          stacks.push({ id: doc.id, name: doc.data().name } as CategoryProps);
        });
        setCategories(stacks);
      } catch (error) {
        console.error("Error fetching card stacks:", error);
      }
    };

    fetchCategories();
  }, [user]);

  return (
    <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4">
        {categories.map((stack, index) => {
          return (
            <Card
              key={index}
              className="w-full aspect-2/3"
              text={stack.name}
              href={{
                pathname: "/practice",
                query: { categoryId: stack.id },
              }}
            />
          );
        })}
        <Card
          className="w-full aspect-2/3 bg-green-200 dark:bg-green-900"
          text="Create New Category"
          href={{
            pathname: "/create-category",
          }}
        />
      </div>
    </div>

  );
}
