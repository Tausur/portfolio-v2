import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

/* -------------------- GET -------------------- */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Admin_info");
    const collection = db.collection("homeProfilePic");

    const profile = await collection.findOne({});
    if (!profile) {
      return NextResponse.json(
        { error: "Home profile pic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch home profile pic" },
      { status: 500 }
    );
  }
}

/* -------------------- PATCH -------------------- */
export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;

    let uploadResult;

    /* -------- Upload from device -------- */
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "homeProfilePics", overwrite: true },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });
    }

    /* -------- Upload from URL -------- */
    else if (imageUrl) {
      uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: "homeProfilePics",
        overwrite: true,
      });
    } else {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!uploadResult?.secure_url) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    /* -------- Save to MongoDB -------- */
    const client = await clientPromise;
    const db = client.db("Admin_info");
    const collection = db.collection("homeProfilePic");

    await collection.updateOne(
      {},
      { $set: { imageUrl: uploadResult.secure_url } },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Home Profile Pic updated!",
      url: uploadResult.secure_url,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
