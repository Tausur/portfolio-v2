import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Admin_info"); // or your DB name
    const collection = db.collection("user_profile");

    const profile = await collection.findOne({});
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) 
      return NextResponse.json({ error: "Image URL required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("Admin_info");
    const collection = db.collection("user_profile");

    // Update the profile picture
    await collection.updateOne({}, { $set: { imageUrl } }, { upsert: true });

    // ✅ Always return JSON
    return NextResponse.json({ message: "About Page Pic updated!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update picture." }, { status: 500 });
  }
}
