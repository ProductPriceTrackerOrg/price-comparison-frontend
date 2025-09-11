import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

/**
 * Toggle a product's favorite status for a user
 *
 * @param productId The product ID to toggle favorite status
 * @param userId The user ID
 * @returns Object with new favorited status and any error
 */
export async function toggleProductFavorite(
  productId: string | number,
  userId: string
): Promise<{
  isFavorited: boolean;
  error: Error | null;
}> {
  // Ensure productId is handled correctly whether it's string or number
  const normalizedProductId =
    typeof productId === "string" && !isNaN(Number(productId))
      ? Number(productId)
      : productId;
  try {
    // First, check if product is already favorited
    const { data: existingFavorite, error: checkError } = await supabase
      .from("userfavorites")
      .select("favorite_id")
      .eq("user_id", userId)
      .eq("variant_id", normalizedProductId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Real error, not just "no rows returned"
      console.error("Error checking favorite status:", checkError);
      return { isFavorited: false, error: checkError };
    }

    // If favorite exists, remove it
    if (existingFavorite) {
      const { error: deleteError } = await supabase
        .from("userfavorites")
        .delete()
        .eq("favorite_id", existingFavorite.favorite_id);

      if (deleteError) {
        console.error("Error removing favorite:", deleteError);
        return { isFavorited: true, error: deleteError };
      }

      // Log the activity
      await logUserActivity(userId, "remove_favorite", normalizedProductId);

      return { isFavorited: false, error: null };
    }
    // Otherwise, add a new favorite
    else {
      const { error: insertError } = await supabase
        .from("userfavorites")
        .insert({
          user_id: userId,
          variant_id: normalizedProductId, // As per requirement, store product_id in variant_id field
        });

      if (insertError) {
        console.error("Error adding favorite:", insertError);
        return { isFavorited: false, error: insertError };
      }

      // Log the activity
      await logUserActivity(userId, "add_favorite", normalizedProductId);

      return { isFavorited: true, error: null };
    }
  } catch (error: any) {
    console.error("Error toggling favorite:", error);
    return { isFavorited: false, error };
  }
}

/**
 * Log user activity related to favorites
 */
export async function logUserActivity(
  userId: string,
  activityType: "add_favorite" | "remove_favorite" | string,
  productId: string | number
): Promise<void> {
  // Ensure productId is handled correctly whether it's string or number
  const normalizedProductId =
    typeof productId === "string" && !isNaN(Number(productId))
      ? Number(productId)
      : productId;

  try {
    await supabase.from("useractivitylog").insert({
      user_id: userId,
      activity_type: activityType,
      variant_id: normalizedProductId, // As per requirement, store product_id in variant_id field
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}

/**
 * Check if a product is favorited by the user
 */
export async function isProductFavorited(
  productId: string | number,
  userId: string | null
): Promise<boolean> {
  // If no user is logged in, product can't be favorited
  if (!userId) return false;

  // Ensure productId is handled correctly whether it's string or number
  const normalizedProductId =
    typeof productId === "string" && !isNaN(Number(productId))
      ? Number(productId)
      : productId;

  try {
    const { data, error } = await supabase
      .from("userfavorites")
      .select("favorite_id")
      .eq("user_id", userId)
      .eq("variant_id", normalizedProductId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking favorite status:", error);
      return false;
    }

    return !!data; // Return true if data exists, false otherwise
  } catch (error) {
    console.error("Error checking if product is favorited:", error);
    return false;
  }
}

/**
 * Get all favorited product IDs for a user
 */
export async function getUserFavorites(
  userId: string | null
): Promise<number[]> {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("userfavorites")
      .select("variant_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user favorites:", error);
      return [];
    }

    // Extract the product IDs from the response
    return data.map((item) => item.variant_id);
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return [];
  }
}
