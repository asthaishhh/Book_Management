// import express from "express";
// import {
//   handleBookStoreController,
//   handleBookListController,
//   handleBookDeleteController,
//   handleBookupdateController,
//   uploadImage,
// } from "../controller/book.controller.js";
// import upload from "../middleware/multer.js";
// import streamifier from "streamifier";
// import cloudinary from "../config/cloudinary.js";
// import { handleBookFilterController } from "../controller/book.controller.js";

// const router = express.Router();

// router.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const streamUpload = () =>
//       new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "books" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           },
//         );
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });

//     const result = await streamUpload();

//     res.json({ imageUrl: result.secure_url });
//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);
//     res.status(500).json({ error: error.message });
//   }
// });



// router.get("/filter", handleBookFilterController);
// router.post("/", handleBookStoreController);
// router.get("/booklists", handleBookListController);
// router.post("/deletebook", handleBookDeleteController);
// router.put("/updatebook", handleBookupdateController);

// export default router;

import express from "express";
import {
  handleBookStoreController,
  handleBookListController,
  handleBookDeleteController,
  handleBookupdateController,
  handleBookFilterController,
} from "../controller/book.controller.js";

import upload from "../middleware/multer.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

import auth from "../middleware/auth.js";
import authorizeRoles from "../middleware/authorize.js";

const router = express.Router();


// ================= IMAGE UPLOAD =================
// Only Admin + User can upload
router.post(
  "/upload",
  auth,
  authorizeRoles("Admin", "User"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "books" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();

      res.json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  }
);


// ================= GET BOOKS =================
// Everyone (Admin, User, Viewer) can view
router.get("/booklists", auth, handleBookListController);


// ================= FILTER =================
// Everyone can filter
router.get("/filter", auth, handleBookFilterController);


// ================= ADD BOOK =================
// Admin + User can add
router.post(
  "/",
  auth,
  authorizeRoles("Admin", "User"),
  handleBookStoreController
);


// ================= UPDATE BOOK =================
// Admin + User can attempt update
router.put(
  "/updatebook",
  auth,
  authorizeRoles("Admin", "User"),
  handleBookupdateController
);


// ================= DELETE BOOK =================
// ONLY Admin can delete
router.post(
  "/deletebook",
  auth,
  authorizeRoles("Admin"),
  handleBookDeleteController
);

export default router;