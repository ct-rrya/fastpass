import express from 'express';
import cors from 'cors';
import prisma from './db.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const app = express();

app.use(cors());
app.use(express.json());

// Run migration on first request (Vercel serverless)
let migrationRun = false;
async function ensureMigration() {
  if (migrationRun) return;
  
  try {
    console.log('Running database migration...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('Migration completed successfully');
    migrationRun = true;
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.log('Continuing with existing database schema...');
    migrationRun = true; // Don't retry on every request
  }
}

// Middleware to ensure migration runs
app.use(async (req, res, next) => {
  await ensureMigration();
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FastPass API',
    database: 'PostgreSQL with Prisma (Supabase)'
  });
});

// Get enrollment status
app.get('/api/enrollment/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    let enrollment = await prisma.enrollment.findUnique({
      where: { studentId }
    });
    
    if (!enrollment) {
      // Initialize new enrollment
      const offices = [
        { id: 'department', name: 'Department Office', icon: '🏢', status: 'pending', queueNumber: null },
        { id: 'clinic', name: 'Clinic', icon: '🏥', status: 'pending', queueNumber: null },
        { id: 'nstp', name: 'NSTP Office', icon: '🎖️', status: 'pending', queueNumber: null },
        { id: 'cashier', name: 'Cashier', icon: '💰', status: 'pending', queueNumber: null },
        { id: 'affairs', name: 'Student Affairs', icon: '👥', status: 'pending', queueNumber: null },
        { id: 'mis', name: 'MIS Office', icon: '💻', status: 'pending', queueNumber: null },
        { id: 'registrar', name: 'Registrar', icon: '📋', status: 'pending', queueNumber: null }
      ];
      
      enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          offices,
          currentQueue: null
        }
      });
    }
    
    res.json({
      studentId: enrollment.studentId,
      offices: enrollment.offices,
      currentQueue: enrollment.currentQueue
    });
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
});

// Join queue
app.post('/api/queue/join', async (req, res) => {
  try {
    const { studentId, officeId, groupType, groupSize, sectionName } = req.body;
    
    // Get or create counter
    let counter = await prisma.queueCounter.findUnique({
      where: { officeId }
    });
    
    if (!counter) {
      counter = await prisma.queueCounter.create({
        data: { officeId, counter: 0 }
      });
    }
    
    // Increment counter
    counter = await prisma.queueCounter.update({
      where: { officeId },
      data: { counter: { increment: 1 } }
    });
    
    const queueNumber = counter.counter;
    
    // Calculate estimated wait
    const waitingCount = await prisma.queue.count({
      where: { officeId, status: 'waiting' }
    });
    
    let estimatedWait;
    if (groupType === 'individual') {
      estimatedWait = waitingCount * 5;
    } else if (groupType === 'group') {
      estimatedWait = Math.ceil(waitingCount / 3) * 10;
    } else {
      estimatedWait = Math.ceil(waitingCount / 30) * 30;
    }
    
    // Add to queue
    await prisma.queue.create({
      data: {
        officeId,
        studentId,
        queueNumber,
        groupType: groupType || 'individual',
        groupSize: groupSize || 1,
        sectionName,
        status: 'waiting'
      }
    });
    
    res.json({ queueNumber, officeId, estimatedWait });
  } catch (error) {
    console.error('Error joining queue:', error);
    res.status(500).json({ error: 'Failed to join queue' });
  }
});

// Get office queue
app.get('/api/queue/:officeId', async (req, res) => {
  try {
    const { officeId } = req.params;
    
    const queue = await prisma.queue.findMany({
      where: { officeId, status: 'waiting' },
      orderBy: { queueNumber: 'asc' }
    });
    
    const current = await prisma.queue.findFirst({
      where: { officeId, status: 'serving' }
    });
    
    let settings = await prisma.officeSetting.findUnique({
      where: { officeId }
    });
    
    if (!settings) {
      settings = { processingMode: 'individual', avgProcessingTime: 5 };
    }
    
    res.json({
      queue: queue.map(q => ({
        id: q.id,
        studentId: q.studentId,
        queueNumber: q.queueNumber,
        groupType: q.groupType,
        groupSize: q.groupSize,
        sectionName: q.sectionName,
        name: q.sectionName || `Student ${q.studentId}`
      })),
      current: current ? {
        id: current.id,
        studentId: current.studentId,
        queueNumber: current.queueNumber,
        groupType: current.groupType,
        groupSize: current.groupSize,
        sectionName: current.sectionName,
        name: current.sectionName || `Student ${current.studentId}`
      } : null,
      settings: {
        processingMode: settings.processingMode,
        avgProcessingTime: settings.avgProcessingTime
      }
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// Call next student
app.post('/api/queue/next', async (req, res) => {
  try {
    const { officeId } = req.body;
    
    // Mark current as completed
    await prisma.queue.updateMany({
      where: { officeId, status: 'serving' },
      data: { status: 'completed' }
    });
    
    // Get next in queue
    const waiting = await prisma.queue.findMany({
      where: { officeId, status: 'waiting' },
      orderBy: { queueNumber: 'asc' },
      take: 1
    });
    
    if (waiting.length > 0) {
      const next = waiting[0];
      
      await prisma.queue.update({
        where: { id: next.id },
        data: { status: 'serving' }
      });
      
      const student = {
        id: next.id,
        studentId: next.studentId,
        queueNumber: next.queueNumber,
        name: `Student ${next.studentId}`
      };
      
      res.json({ student });
    } else {
      res.json({ student: null });
    }
  } catch (error) {
    console.error('Error calling next:', error);
    res.status(500).json({ error: 'Failed to call next student' });
  }
});

// Mark completed
app.post('/api/enrollment/complete', async (req, res) => {
  try {
    const { officeId, studentId } = req.body;
    
    // Update enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId }
    });
    
    if (enrollment) {
      const offices = enrollment.offices;
      const updatedOffices = offices.map(o =>
        o.id === officeId ? { ...o, status: 'completed' } : o
      );
      
      await prisma.enrollment.update({
        where: { studentId },
        data: { offices: updatedOffices }
      });
    }
    
    // Mark queue as completed
    await prisma.queue.updateMany({
      where: { officeId, studentId },
      data: { status: 'completed' }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking complete:', error);
    res.status(500).json({ error: 'Failed to mark complete' });
  }
});

// Update office settings
app.post('/api/office/settings', async (req, res) => {
  try {
    const { officeId, settings } = req.body;
    
    await prisma.officeSetting.upsert({
      where: { officeId },
      update: {
        processingMode: settings.processingMode,
        avgProcessingTime: settings.avgProcessingTime
      },
      create: {
        officeId,
        processingMode: settings.processingMode,
        avgProcessingTime: settings.avgProcessingTime
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get office settings
app.get('/api/office/settings/:officeId', async (req, res) => {
  try {
    const { officeId } = req.params;
    
    let settings = await prisma.officeSetting.findUnique({
      where: { officeId }
    });
    
    if (!settings) {
      settings = {
        processingMode: 'individual',
        avgProcessingTime: 5
      };
    }
    
    res.json({
      processingMode: settings.processingMode,
      avgProcessingTime: settings.avgProcessingTime
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Export for Vercel
export default app;
