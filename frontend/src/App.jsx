import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [images, setImages] = useState([
    {
      original: "https://res.cloudinary.com/dnoqujyz6/image/upload/v1746291003/1_1_nwvqu4.jpg",
      converted: "https://res.cloudinary.com/dnoqujyz6/image/upload/w_512,h_512,c_fill/v1746291003/1_1_nwvqu4.jpg",
    },
    {
      original: "https://res.cloudinary.com/dnoqujyz6/image/upload/v1746291035/2_1_oqg3bl.jpg",
      converted: "https://res.cloudinary.com/dnoqujyz6/image/upload/w_512,h_512,c_fill/v1746291035/2_1_oqg3bl.jpg",
    },
    {
      original: "https://res.cloudinary.com/dnoqujyz6/image/upload/v1746291046/3_1_unhudz.jpg",
      converted: "https://res.cloudinary.com/dnoqujyz6/image/upload/w_512,h_512,c_fill/v1746291046/3_1_unhudz.jpg",
    }
  ]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${backendURL}/images`);
      const data = await response.json();
      console.log("Fetched Images:", data);
      setImages((prev) => [...prev, ...data]);  
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${backendURL}/upload`, {
        method: "POST",
        body: formData,
      });
      const imageData = await response.json(); 

      setImages((prevImages) => [...prevImages, imageData]);

    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="container">
      <h1>Image Processor</h1>
      <input type="file" onChange={handleUpload} accept="image/*" />
      <div className="gallery">
        {images.map((img, idx) => (
          <div key={idx} className="card">
            <p><strong>Original:</strong></p>
            <img src={img.original} alt="original" />
            <p><strong>Processed (512x512):</strong></p>
            <img src={img.converted} alt="converted" />
            <a
              className="btn"
              href={img.converted}  
              download
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
