import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Projects");
    const collection = db.collection("myProjects");

    const projects = await collection
      .find({})
      .sort({ createdAt: -1 }) // latest first
      .limit(3)
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}
