const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

router.post("/", async (req, res) => {
  try {
    const { image } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "sarees-den",
    });

    res.json({
      success: true,
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
