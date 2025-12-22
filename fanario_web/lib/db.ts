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
import { Creator, Publication, creators as sampleCreators, publications as samplePublications } from "./sampleData";

// Convertir datos de Firestore a nuestros tipos
const mapDocToPost = (doc: any): Publication => {
  const data = doc.data();
  return {
    id: doc.id,
    creatorId: data.creatorId,
    title: data.title,
    excerpt: data.excerpt,
    image: data.mediaUrl || undefined, // Adaptar nombre de campo
    isPublic: data.isPublic,
    date: data.createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
  };
};

export async function getPublicPosts(): Promise<Publication[]> {
  try {
    const q = query(
      collection(db, "posts"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return samplePublications; // Fallback a sample data si está vacío
    
    return snapshot.docs.map(mapDocToPost);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return samplePublications;
  }
}

export async function getCreators(): Promise<Creator[]> {
  try {
    const q = query(collection(db, "creators"), limit(20));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return sampleCreators;

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Sin nombre",
        bio: data.bio || "",
        category: data.category || "General",
        price: data.price || 0,
        avatar: data.avatar || "https://via.placeholder.com/150",
        cover: data.cover || "https://via.placeholder.com/800x200",
      };
    });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return sampleCreators;
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
        avatar: data.avatar || "https://via.placeholder.com/150",
        cover: data.cover || "https://via.placeholder.com/800x200",
      };
    }
    // Fallback a sample data si no existe en DB (para desarrollo)
    return sampleCreators.find(c => c.id === id);
  } catch (error) {
    console.error("Error fetching creator:", error);
    return sampleCreators.find(c => c.id === id);
  }
}

export async function getCreatorPosts(creatorId: string): Promise<Publication[]> {
  try {
    const q = query(
      collection(db, "posts"),
      where("creatorId", "==", creatorId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Si es uno de los creadores de ejemplo, devolver sus posts de ejemplo
      const sample = samplePublications.filter(p => p.creatorId === creatorId);
      return sample;
    }
    
    return snapshot.docs.map(mapDocToPost);
  } catch (error) {
    console.error("Error fetching creator posts:", error);
    return samplePublications.filter(p => p.creatorId === creatorId);
  }
}
