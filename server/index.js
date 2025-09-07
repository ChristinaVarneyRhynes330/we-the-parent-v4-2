const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit [cite: 2637]
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.')); [cite: 2643]
    }
  }
});

// Simulated Al responses for different legal scenarios
const legalResponses = {
  motion: `Based on your request for a motion, I can help you draft a **Motion for Increased Visitation**. Here's what we need:

**Required Information:**
1. Current visitation schedule and restrictions
2. Specific progress you've made in your case plan
3. Evidence of compliance (completed classes, drug tests, etc.)
4. Proposed new visitation schedule

**Legal Structure:**
- **Caption**: Court name, case number, parties
- **Introduction**: Your status as parent and purpose of motion
- **Statement of Facts**: Detailed progress since last order
- **Argument**: Legal basis for increased visitation
- **Prayer for Relief**: Specific request to the court

Would you like me to help you gather the specific information needed for your case?`, [cite: 453-466]
  timeline: `The **Florida Dependency Process** follows these key phases:

**Phase 1: Investigation & Shelter (0-24 hours)**
- DCF receives report and investigates
- Emergency removal if necessary
- Shelter hearing within 24 hours
- Court appoints attorney if you qualify

**Phase 2: Arraignment & Case Plan (30 days)**
- Formal charges filed (petition)
- You enter plea (admit, deny, or no contest)
- Case plan developed with required services
- GAL appointed for child

**Phase 3: Adjudication (45-90 days)**
- Court determines if allegations are true
- If sustained, case moves to disposition
- You can still work your case plan during this time

**Phase 4: Disposition & Services (ongoing)**
- Court orders specific services and timeline
- Regular review hearings (every 6 months)
- Progress monitored by case manager

**Phase 5: Permanency Planning (12+ months)**
- Court decides permanent placement
- Options: reunification, relative placement, adoption, or guardianship

**Current Focus**: What phase is your case in? I can provide specific guidance for your situation.`, [cite: 467-489]
  evidence: `For your dependency case, you'll need to gather **evidence of progress and compliance**:

**Documentation Checklist:**
☑ **Service Compliance**
- Certificates of completion for required classes
- Attendance records for counseling/therapy
- Drug/alcohol test results (if applicable)
- Visitation logs and supervisor reports
☑ **Housing & Stability**
- Lease agreement or housing documentation
- Utility bills showing stable residence
- Employment verification or income documentation
☑ **Parenting Progress**
- Photos/videos of positive interactions with child
- School/daycare communication records
- Medical appointment records you've attended
☑ **Support System**
- Character reference letters
- Documentation of family support
- Community involvement records

**Organizing Your Evidence:**
1. Create a chronological timeline of your progress
2. Make copies of everything (keep originals safe)
3. Prepare a brief summary for each document
4. Bring an organized binder to all hearings

What specific type of evidence are you looking to strengthen for your case?`, [cite: 490-518]
  hearing: `Here's how to **prepare for your next dependency hearing**:

**Before the Hearing:**
☑ **Document Review**
- Review case plan and your compliance status
- Gather all certificates and proof of progress
- Prepare a written update of completed services
- Organize evidence chronologically
**Professional Presentation**
- Dress professionally (business casual minimum)
- Arrive 15 minutes early
- Bring a notebook and pen for taking notes
- Turn off your phone or put on silent
**What to Expect**
- The Judge will review case status and progress
- DCF will provide their recommendation
- The GAL will report on the child's best interests
- You'll have an opportunity to speak
**Key Speaking Points:**
1. Specific progress you've made since the last hearing
2. Services completed and skills learned
3. How you've applied new skills with your child
4. Your plan for continued progress
5. Why increased contact/reunification is appropriate
**Questions to Ask:**
- "What additional steps can I take to move my case forward?"
- "When can we discuss increased visitation?"
- "What services would strengthen my case?"

**Remember**: Stay calm, be respectful, focus on your child's best interests, and highlight your positive changes. What type of hearing is coming up, and what specific concerns do you have about it?` [cite: 519-547]
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Chat endpoint with simulated Al
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, caseContext, model = 'simulated' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine response type based on prompt keywords
    let response = "I understand you're seeking guidance on your dependency case. ";
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('motion') || promptLower.includes('file') || promptLower.includes('petition')) {
      response = legalResponses.motion;
    } else if (promptLower.includes('timeline') || promptLower.includes('process') || promptLower.includes('phases')) {
      response = legalResponses.timeline;
    } else if (promptLower.includes('evidence') || promptLower.includes('document') || promptLower.includes('proof')) {
      response = legalResponses.evidence;
    } else if (promptLower.includes('hearing') || promptLower.includes('court') || promptLower.includes('judge')) {
      response = legalResponses.hearing;
    } else {
      response += `As your Al legal assistant, I can help with:

- **Document Drafting**: Motions, affidavits, responses
- **Case Strategy**: Understanding the process and your options
- **Evidence Preparation**: What to gather and how to organize it
- **Hearing Preparation**: What to expect and how to present yourself

${caseContext?.caseNumber ? `For case ${caseContext.caseNumber}:` : ''}Could you be more specific about what aspect of your case you'd like help with?

**Reminder**: I provide educational information and document assistance, not legal advice. For complex legal questions, consult with an attorney.`;
    }

    res.json({
      response,
      model: 'We The Parent Al (Simulated)',
      timestamp: new Date().toISOString(),
      caseContext: caseContext || null
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'Al service temporarily unavailable. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
});

// File upload endpoint
app.post('/api/upload', upload.array('documents', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date().toISOString(),
      path: file.path
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
      count: uploadedFiles.length
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
});

// Simple auth simulation (for development only)
app.post('/api/auth', (req, res) => {
  const { action, email, password } = req.body;
  // Simulate auth delay
  setTimeout(() => {
    if (action === 'login') {
      res.json({
        success: true,
        user: { id: 'demo-user', email: email, name: 'Demo Parent' },
        token: 'demo-token-' + Date.now()
      });
    } else if (action === 'register') {
      res.json({
        success: true,
        message: 'Registration successful',
        user: { id: 'new-user', email: email, name: 'New Parent' }
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  }, 1000);
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`We The Parent API Server running on http://localhost:${PORT}`); [cite: 664]
  console.log(`Health check: http://localhost:${PORT}/health`); [cite: 666]
  console.log(`Chat API: http://localhost:${PORT}/api/chat`); [cite: 668]
  console.log(`Upload API: http://localhost:${PORT}/api/upload`); [cite: 669]
});

module.exports = app;