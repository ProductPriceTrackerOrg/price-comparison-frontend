// API client for favorites
import { supabase } from "@/lib/supabase";

// We need to access environment variables at runtime
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FavoriteProduct {
  id: number;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  original_price?: number;
  image?: string;
  retailer: string;
  retailer_phone?: string;
  retailer_whatsapp?: string;
  discount?: number;
  is_available: boolean;
  variant_id: number;
}

export interface FavoritesResponse {
  favorites: FavoriteProduct[];
}

/**
 * Fetches user's favorites from the API
 */
export async function getUserFavorites(): Promise<FavoritesResponse> {
  // Get the session
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session) {
    throw new Error("User is not authenticated");
  }
  
  const token = sessionData.session.access_token;
  
  const response = await fetch(`${API_URL}/api/v1/favorites/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch favorites: ${response.status}`
    );
  }
  
  return await response.json();
}

/**
 * Adds a product to favorites via the API
 */
export async function addToFavorites(productId: number): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session) {
    throw new Error("User is not authenticated");
  }
  
  const token = sessionData.session.access_token;
  
  const response = await fetch(`${API_URL}/api/v1/favorites/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_id: productId }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to add favorite: ${response.status}`
    );
  }
}

/**
 * Removes a product from favorites via the API
 */
export async function removeFromFavorites(productId: number): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session) {
    throw new Error("User is not authenticated");
  }
  
  const token = sessionData.session.access_token;
  
  const response = await fetch(`${API_URL}/api/v1/favorites/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to remove favorite: ${response.status}`
    );
  }
}
