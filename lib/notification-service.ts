import { supabase } from "@/lib/supabase";

/**
 * Check if a user has notification settings
 * @param userId The user ID to check
 * @returns Boolean indicating whether the user has notification settings
 */
export async function checkUserNotificationSettings(
  userId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("usernotificationsettings")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // Real error, not just "no rows returned"
      console.error("Error checking notification settings:", error);
      return false;
    }

    return !!data; // Return true if data exists, false otherwise
  } catch (error) {
    console.error("Error checking notification settings:", error);
    return false;
  }
}

/**
 * Create default notification settings for a user
 * @param userId The user ID to create settings for
 * @returns Object with success status and any error
 */
export async function createUserNotificationSettings(userId: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase.from("usernotificationsettings").insert({
      user_id: userId,
      notify_on_price_drop: true,
      notify_on_anomaly: false,
      price_drop_threshold_percent: 0,
      receive_weekly_report: true,
      weekly_report_day: "SUNDAY",
    });

    if (error) {
      console.error("Error creating notification settings:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error creating notification settings:", error);
    return { success: false, error };
  }
}
