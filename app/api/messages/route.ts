import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";


export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Messages");
    const collection = db.collection("user_messages");

    const result = await collection.insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Messages");
    const collection = db.collection("user_messages");

    const messages = await collection.find({}).sort({ _id: -1 }).toArray();
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: "_id is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("Messages");
    const collection = db.collection("user_messages");

    // ✅ Convert _id string to MongoDB ObjectId
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}