import { v2 as cloudinary } from "cloudinary";

// Using CLOUDINARY_URL directly
cloudinary.config({
  secure: true,
});

export default cloudinary;
