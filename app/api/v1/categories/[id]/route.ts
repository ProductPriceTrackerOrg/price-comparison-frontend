import { NextResponse } from "next/server";
import { findCategoryById } from "@/lib/category-data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = parseInt(params.id, 10);

  // Get the category from our data
  const category = findCategoryById(categoryId);

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({
    category: category,
  });
}
