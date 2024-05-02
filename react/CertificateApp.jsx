import React, { useState } from "react";
import "./App.css";

const CertificateApp = () => {
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(capitalize(e.target.value));
  };

  const handleSubmit = () => {
    if (name.trim() !== "" && name.length >= 3 && name.length <= 16) {
      generatePDF(name);
    } else {
      alert("Please enter a valid name (3 to 16 characters).");
    }
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const generatePDF = async (name) => {
    const existingPdfBytes = await fetch("./cer.pdf").then((res) =>
      res.arrayBuffer()
    );

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    //get font
    const fontBytes = await fetch("./Sanchez-Regular.ttf").then((res) =>
      res.arrayBuffer()
    );

    // Embed our custom font in the document
    const SanChezFont = await pdfDoc.embedFont(fontBytes);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Draw a string of text diagonally across the first page
    firstPage.drawText(name, {
      x: 280,
      y: 300,
      size: 50,
      font: SanChezFont,
      color: PDFLib.rgb(0, 0, 0),
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    console.log("Done creating");

    var file = new File([pdfBytes], "quzzificate.pdf", {
      type: "application/pdf;charset=utf-8",
    });
    saveAs(file);
  };

  return (
    <div className="App">
      <header>
        <img src="./padhega india.png" alt="quizzificate" />
        <h4>Get your certificate of participation </h4>
        <h1>
          <a href="/" target="_blank" rel="noopener noreferrer">
            quizzificate
          </a>
        </h1>
      </header>
      <main>
        <label htmlFor="name">Type Your Name</label>
        <input
          required
          type="text"
          name="Name"
          autoComplete="name"
          placeholder="Your name"
          id="name"
          minLength="3"
          maxLength="16"
          value={name}
          onChange={handleChange}
        />
        <button id="submitBtn" onClick={handleSubmit}>
          Get Certificate
        </button>
      </main>
    </div>
  );
};

export default CertificateApp;
