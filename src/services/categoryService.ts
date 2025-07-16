import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import db from "@/utils/firestore";
import { CategoryProps } from "@/types/category";

type CreateCategoryParams = {
  userId: string;
  categoryName: string;
};

type GetCategoryParams = {
  userId: string;
};

type GetCategoryByIdParams = {
  userId: string;
  categoryId: string;
};

type EditCategoryParams = {
  userId: string;
  categoryId: string;
  updatedFields: Partial<Pick<CategoryProps, "name">>;
};

type DeleteCategoryParams = {
  userId: string;
  categoryId: string;
};

export const createCategory = async ({ userId, categoryName }: CreateCategoryParams) => {
  await addDoc(collection(db, "users", userId, "categories"), {
      name: categoryName,
      createdAt: serverTimestamp(),
  });  
};

export const getAllCategories = async ({ userId }: GetCategoryParams): Promise<CategoryProps[]> => {
  const querySnapshot = await getDocs(collection(db, "users", userId, "categories"));
  const stacks: CategoryProps[] = [];
  querySnapshot.forEach((doc) => {
    stacks.push({ id: doc.id, name: doc.data().name } as CategoryProps);
  });
  return stacks;
};

export const getCategoryById = async ({userId, categoryId}: GetCategoryByIdParams): Promise<CategoryProps | null> => {
  const categoryRef = doc(db, "users", userId, "categories", categoryId);
  const categorySnapshot = await getDoc(categoryRef);

  if (!categorySnapshot.exists()) {
    return null;
  }

  return {
    id: categorySnapshot.id,
    name: categorySnapshot.data().name,
  };
}

export const editCategory = async ({ userId, categoryId, updatedFields }: EditCategoryParams) => {
  const categoryRef = doc(db, "users", userId, "categories", categoryId);
  await updateDoc(categoryRef, {
    ...updatedFields,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCategory = async ({ userId, categoryId }: DeleteCategoryParams) => {
  const categoryRef = doc(db, "users", userId, "categories", categoryId);
  await deleteDoc(categoryRef);
};