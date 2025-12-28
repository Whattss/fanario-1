import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Creator, Publication } from "./sampleData";

const mapDocToPost = (docSnap: any): Publication => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    creatorId: data.creatorId,
    title: data.title,
    excerpt: data.excerpt,
    image: data.mediaUrl || data.image || undefined,
    video: data.video || undefined,
    isPublic: data.isPublic,
    date: data.createdAt?.toDate?.()?.toISOString?.().split('T')[0] || new Date().toISOString().split('T')[0],
  };
};

export async function getPublicPosts(): Promise<Publication[]> {
  try {
    const q = query(
      collection(db, "publications"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToPost);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getCreators(): Promise<Creator[]> {
  try {
    const q = query(collection(db, "creators"), limit(50));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || "Sin nombre",
        bio: data.bio || "",
        category: data.category || "General",
        price: data.price || 0,
        avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=60",
        cover: data.cover || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      };
    });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return [];
  }
}

export async function getCreatorById(id: string): Promise<Creator | undefined> {
  try {
    const docRef = doc(db, "creators", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        bio: data.bio,
        category: data.category,
        price: data.price,
        avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=60",
        cover: data.cover || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      };
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching creator:", error);
    return undefined;
  }
}

export async function getCreatorPosts(creatorId: string): Promise<Publication[]> {
  try {
    const q = query(
      collection(db, "publications"),
      where("creatorId", "==", creatorId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToPost);
  } catch (error) {
    console.error("Error fetching creator posts:", error);
    return [];
  }
}
