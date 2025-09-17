require('dotenv').config(); // This line is new!

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3001;

// Basic security headers
const helmet = require('helmet');
app.use(helmet());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Middleware for logging
const morgan = require('morgan');
app.use(morgan('dev'));

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure Multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// --- API Routes ---

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Chat endpoint
app.post('/api/chat', express.json(), async (req, res) => {
  const { prompt, caseContext, documents } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Construct a detailed prompt for OpenAI
    let systemPrompt = `You are "We The Parent," an AI legal assistant. Your goal is to provide helpful, accurate information to a mother self-representing in a Florida juvenile dependency case. Do not provide legal advice.

Case Context:
- Case Name: ${caseContext.caseName || 'Not Provided'}
- Case Number: ${caseContext.caseNumber || 'Not Provided'}
- Current Phase: ${caseContext.casePhase || 'Not Provided'}
`;

    if (documents && documents.length > 0) {
      systemPrompt += '\nRelevant Documents:\n';
      documents.forEach(doc => {
        systemPrompt += `- ${doc.filename}\n`;
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with the AI service' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.array('documents', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  }));

  res.status(201).json({
    message: 'Files uploaded successfully',
    count: req.files.length,
    files: uploadedFiles,
  });
});

// --- Server Startup ---
module.exports = app;
