import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Projects");
    const collection = db.collection("myProjects");
    const projects = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const project = await req.json();
    const client = await clientPromise;
    const db = client.db("Projects");
    const collection = db.collection("myProjects");
    project.createdAt = new Date();
    await collection.insertOne(project);
    return NextResponse.json({ message: "Project added successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ---------------- PATCH METHOD -----------------
export async function PATCH(req: Request) {
  const { _id, updates } = await req.json();

  // Exclude _id from updates
  const { _id: _, ...fieldsToUpdate } = updates;

  const { db } = await connectToDB();
  const collection = db.collection("myProjects");

  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: fieldsToUpdate }
  );

  return new Response(JSON.stringify({ message: "Project updated!" }));
}