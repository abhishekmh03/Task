require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const cloud_name = process.env.cloud_name;
const  api_key =  process.env. api_key;
const  api_secret =  process.env.api_secret;

app.use(cors());

// Cloudinary 
cloudinary.config({
  cloud_name: cloud_name,  
  api_key: api_key,        
  api_secret: api_secret,  
});

// Multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'image-uploads',  
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],  
  },
});
console.log("Cloudinary Storage Configured: ", storage);
console.log("Cloudinary Config: ", {
    cloud_name,
    api_key,
    api_secret,
  });
const upload = multer({ storage });

let imageDB = [];  


app.post("/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const uploadedImage = req.file;
  
      const resizedImageUrl = cloudinary.url(uploadedImage.filename, {
        width: 512,
        height: 512,
        crop: 'fill',
        format: 'jpg'  
      });
  
      const imageEntry = {
        original: uploadedImage.path,
        converted: resizedImageUrl,
        convertedFilename: uploadedImage.filename,
      };
  
      imageDB.push(imageEntry);
      res.json(imageEntry);
    } catch (err) {
      console.error("Error in /upload:", err);
      res.status(500).json({ error: "Image processing failed." });
    }
  });
  
  


app.get("/images", (req, res) => {
  res.json(imageDB);  
});


app.get("/download/:filename", (req, res) => {
    const cloudinaryDownloadUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/${req.params.filename}`;
    res.redirect(cloudinaryDownloadUrl);  
});

app.listen(PORT, () => console.log(`Server is running`));
