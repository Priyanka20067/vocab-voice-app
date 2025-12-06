const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  transcript: String,
  pronunciationScore: Number,
  spellingScore: Number,
  feedback: String,
  isCorrect: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const wordResultSchema = new mongoose.Schema({
  word: { type: String, required: true },
  attempts: [attemptSchema],
  finalScore: Number,
  completed: { type: Boolean, default: false },
  mode: { type: String, enum: ['pronounce', 'spell'], required: true }
});

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, unique: true },
  extractedWords: [String],
  wordResults: [wordResultSchema],
  currentWordIndex: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'paused'], 
    default: 'active' 
  },
  mode: { 
    type: String, 
    enum: ['pronounce', 'spell'], 
    required: true 
  },
  overallScore: Number,
  completedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);