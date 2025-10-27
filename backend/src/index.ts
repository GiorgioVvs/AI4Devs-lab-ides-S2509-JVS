import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/cv');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

const port = 3010;

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Validation middleware for candidate creation
const validateCandidate = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('education').notEmpty().withMessage('Education is required'),
  body('work_experience').notEmpty().withMessage('Work experience is required')
];

// Helper function to check if email already exists
async function checkEmailExists(email: string): Promise<boolean> {
  const existing = await prisma.candidate.findUnique({
    where: { email }
  });
  return existing !== null;
}

// POST /api/candidates endpoint
app.post('/api/candidates', upload.single('cv'), validateCandidate, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { first_name, last_name, email, phone, address, education, work_experience } = req.body;

    // Check if email already exists
    if (await checkEmailExists(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists in the database'
      });
    }

    // Parse JSON fields
    let educationData, workExperienceData;
    try {
      educationData = typeof education === 'string' ? JSON.parse(education) : education;
      workExperienceData = typeof work_experience === 'string' ? JSON.parse(work_experience) : work_experience;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in education or work_experience fields'
      });
    }

    // Get file path if file was uploaded
    let cvFilePath: string | null = null;
    if (req.file) {
      cvFilePath = `/uploads/cv/${req.file.filename}`;
    }

    // Create candidate in database
    const candidate = await prisma.candidate.create({
      data: {
        first_name,
        last_name,
        email,
        phone,
        address,
        education: educationData,
        work_experience: workExperienceData,
        cv_file_path: cvFilePath
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate
    });

  } catch (error: any) {
    console.error('Error creating candidate:', error);
    
    // If there's a database error and a file was uploaded, clean it up
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create candidate',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
  }

  res.type('application/json');
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: err.message
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default prisma;
