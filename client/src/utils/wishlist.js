import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

// Add to wishlist
export const addToWishlist = async (userId, saree) => {
  await addDoc(collection(db, "wishlist"), {
    userId,
    sareeId: saree.id,
    name: saree.name,
    price: saree.price,
    image: saree.image,
    createdAt: new Date(),
  });
};

// Remove from wishlist
export const removeFromWishlist = async (userId, sareeId) => {
  const q = query(
    collection(db, "wishlist"),
    where("userIdid", "==", userId),
    where("sareeId", "==", sareeId)
  );

  const snapshot = await getDocs(q);
  snapshot.forEach(async (docItem) => {
    await deleteDoc(doc(db, "wishlist", docItem.id));
  });
};
