import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

// Setup pdf js worker for Vite
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const TicketUpload = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0); // 0-100

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type.startsWith("image/"))
    ) {
      setFile(selectedFile);
      setError("");
      setTicketNumber("");
      setProgress(0);
    } else {
      setError("Please select a valid PDF or image file.");
      setFile(null);
    }
  };

  const extractTextFromPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(Math.round((i / pdf.numPages) * 30)); // PDF extraction takes 30% of progress
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }
      return fullText;
    } catch (err) {
      console.error("Error extracting text from PDF:", err);
      throw new Error("Failed to read PDF file.");
    }
  };

  const extractWithOCR = async (pdfFile) => {
    try {
      // For OCR, we need to convert PDF page to image.
      // We will render the first page of the PDF to a canvas and pass it to Tesseract.
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1); // Assuming ticket number is on the first page

      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      setProgress(50); // Image rendered, moving to OCR

      const {
        data: { text },
      } = await Tesseract.recognize(canvas, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(50 + Math.round(m.progress * 50));
          }
        },
      });
      return text;
    } catch (err) {
      console.error("OCR Error:", err);
      throw new Error("Failed to perform OCR on the PDF.");
    }
  };

  const extractImageWithOCR = async (imageFile) => {
    try {
      setProgress(50); // Start OCR
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(50 + Math.round(m.progress * 50));
          }
        },
      });
      return text;
    } catch (err) {
      console.error("OCR Error:", err);
      throw new Error("Failed to perform OCR on the image.");
    }
  };

  const findTicketNumber = (text) => {
    // Basic regex to find common ticket number patterns
    // Update these regex patterns based on actual expected ticket number formats
    // E.g., looking for "Ticket Number: 123456" or "PNR: ABCDEF"
    const patterns = [
      /(?:Ticket\s*(?:No|Number|#)?:?|Booking\s*(?:Ref|Reference)?:?|PNR:?)\s*([A-Za-z0-9]{5,15})/i,
      /([A-Z0-9]{6})/, // Common PNR format - 6 alphanumeric chars
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].toUpperCase();
      }
    }
    return null;
  };

  const processFile = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setTicketNumber("");
    setProgress(5);

    try {
      let text = "";
      let foundTicket = null;

      if (file.type === "application/pdf") {
        // 1. Try regular PDF text extraction
        text = await extractTextFromPDF(file);
        setProgress(40);

        foundTicket = findTicketNumber(text);

        // 2. If no ticket number found, fallback to OCR
        if (!foundTicket) {
          setProgress(45);
          text = await extractWithOCR(file);
          foundTicket = findTicketNumber(text);
        }
      } else if (file.type.startsWith("image/")) {
        text = await extractImageWithOCR(file);
        foundTicket = findTicketNumber(text);
      }

      if (foundTicket) {
        setTicketNumber(foundTicket);
        setProgress(100);
      } else {
        setError(`Could not find a ticket number in the provided ${file.type === "application/pdf" ? "PDF" : "image"}.`);
        setProgress(100);
      }
    } catch (err) {
      setError(err.message || "An error occurred while processing the file.");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-6 pt-12 flex flex-col pt-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Ticket</h1>
      <p className="text-gray-500 mb-8">
        Upload your PDF or image ticket to automatically extract your booking details.
      </p>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
        onClick={() => document.getElementById("file-upload").click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf,image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />

        {file ? (
          <div className="flex flex-col items-center text-center">
            <FileText className="w-12 h-12 text-blue-500 mb-3" />
            <p className="text-gray-900 font-medium">{file.name}</p>
            <p className="text-gray-500 text-sm mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-900 font-medium mb-1">Tap to upload PDF or Image</p>
            <p className="text-gray-500 text-sm">Supported formats: PDF, PNG, JPG</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-xl flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Process Button */}
      <button
        onClick={processFile}
        disabled={!file || isProcessing}
        className={`w-full py-4 rounded-xl mt-8 font-semibold text-lg flex justify-center items-center transition-all ${
          !file || isProcessing
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800 shadow-md"
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Processing ({progress}%)
          </>
        ) : (
          "Extract Ticket Data"
        )}
      </button>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Result Card */}
      {ticketNumber && !isProcessing && (
        <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-800">
              Extraction Successful
            </h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            We found your ticket number automatically.
          </p>

          <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
              Ticket Number / PNR
            </span>
            <span className="text-3xl font-bold text-gray-900 tracking-wider font-mono">
              {ticketNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketUpload;
