const OpenAI = require('openai');
const fs = require('fs').promises;
const FormData = require('form-data');

class SpeechService {
  constructor() {
    this.useMockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-replace-with-real-key';
    
    if (!this.useMockMode) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
    
    console.log(`Speech Service running in ${this.useMockMode ? 'MOCK' : 'LIVE'} mode`);
  }

  async transcribeAudio(audioPath) {
    try {
      console.log('Transcribing audio:', audioPath);
      
      // Mock mode - return empty to trigger browser speech recognition
      if (this.useMockMode) {
        await fs.unlink(audioPath).catch(err => console.log('Audio cleanup error:', err));
        // Return empty so frontend uses Web Speech API
        return '';
      }
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: await fs.readFile(audioPath),
        model: 'whisper-1',
        language: 'en'
      });

      await fs.unlink(audioPath).catch(err => console.log('Audio cleanup error:', err));

      return transcription.text.toLowerCase().trim();
    } catch (error) {
      console.error('Speech transcription error:', error);
      return ''; // Return empty to use browser recognition
    }
  }

  async evaluatePronunciation(targetWord, transcript, mode = 'pronounce') {
    try {
      // Always use fallback evaluation (works without OpenAI)
      return this.fallbackEvaluation(targetWord, transcript, mode);
    } catch (error) {
      console.error('Pronunciation evaluation error:', error);
      return this.fallbackEvaluation(targetWord, transcript, mode);
    }
  }

  createEvaluationPrompt(targetWord, transcript, mode) {
    return `
You are a pronunciation and spelling evaluation AI. Evaluate the user's attempt strictly and provide JSON output only.

Target word: "${targetWord}"
User said: "${transcript}"
Mode: ${mode}

Scoring rules:
- 90-100: Excellent (perfect or near-perfect)
- 70-89: Good (minor errors)
- 50-69: Needs Improvement (noticeable errors)
- 0-49: Poor (significant errors)

Return ONLY this JSON format:
{
  "pronunciation_score": <number 0-100>,
  "spelling_score": <number 0-100>,
  "is_correct": <boolean>,
  "feedback": "<specific feedback about pronunciation/spelling>",
  "phonetic_similarity": <number 0-100>,
  "retry_suggested": <boolean>
}

Be strict but encouraging. Focus on ${mode === 'pronounce' ? 'pronunciation accuracy' : 'spelling accuracy'}.`;
  }

  processEvaluation(evaluation, targetWord, transcript) {
    const isCorrect = evaluation.pronunciation_score >= 70 && evaluation.spelling_score >= 70;
    
    return {
      word: targetWord,
      transcript: transcript,
      pronunciationScore: evaluation.pronunciation_score,
      spellingScore: evaluation.spelling_score,
      feedback: evaluation.feedback,
      isCorrect: isCorrect,
      retry: !isCorrect,
      phoneticSimilarity: evaluation.phonetic_similarity || 0
    };
  }

  fallbackEvaluation(targetWord, transcript, mode) {
    // Normalize both strings for comparison
    const normalizedTarget = targetWord.toLowerCase().trim();
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Check exact match first
    if (normalizedTarget === normalizedTranscript) {
      return {
        word: targetWord,
        transcript: transcript,
        pronunciationScore: 100,
        spellingScore: 100,
        feedback: '🎉 Perfect! Excellent pronunciation!',
        isCorrect: true,
        retry: false,
        phoneticSimilarity: 100
      };
    }
    
    // Calculate similarity
    const similarity = this.calculateStringSimilarity(normalizedTarget, normalizedTranscript);
    const score = Math.round(similarity * 100);
    
    // More lenient scoring
    let isCorrect = false;
    let feedback = '';
    
    if (score >= 90) {
      isCorrect = true;
      feedback = '✅ Excellent! Very close pronunciation!';
    } else if (score >= 75) {
      isCorrect = true;
      feedback = '👍 Good job! Minor differences but well done!';
    } else if (score >= 60) {
      isCorrect = false;
      feedback = `⚠️ Close! You said "${transcript}". Try saying "${targetWord}" again.`;
    } else {
      isCorrect = false;
      feedback = `❌ Not quite. You said "${transcript}". The word is "${targetWord}". Try again!`;
    }
    
    return {
      word: targetWord,
      transcript: transcript,
      pronunciationScore: score,
      spellingScore: score,
      feedback: feedback,
      isCorrect: isCorrect,
      retry: !isCorrect,
      phoneticSimilarity: score
    };
  }

  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

module.exports = new SpeechService();