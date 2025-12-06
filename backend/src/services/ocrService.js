const Tesseract = require('tesseract.js');
const fs = require('fs').promises;

class OCRService {
  async extractTextFromImage(imagePath) {
    try {
      console.log('Starting OCR processing for:', imagePath);
      
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
        logger: m => console.log('OCR Progress:', m)
      });

      // Clean up the uploaded file
      await fs.unlink(imagePath).catch(err => console.log('File cleanup error:', err));

      return this.processExtractedText(text);
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  processExtractedText(text) {
    // Clean and extract words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 2) // Filter short words
      .filter(word => /^[a-z]+$/.test(word)) // Only alphabetic words
      .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

    console.log('Extracted words:', words);
    return words;
  }

  async validateImage(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    return true;
  }
}

module.exports = new OCRService();