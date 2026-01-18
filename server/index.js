import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import prisma from './db.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Run migration on startup
async function runMigration() {
  try {
    console.log('Running database migration...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.log('Continuing with existing database schema...');
  }
}

// WebSocket connections
const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'register') {
      clients.set(data.userId, ws);
    }
  });

  ws.on('close', () => {
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
      }
    }
  });
});

function broadcast(type, data) {
  const message = JSON.stringify({ type, data });
  clients.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(message);
    }
  });
}

// API Routes

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
    
    // Calculate estimated wait based on group type
    const waitingCount = await prisma.queue.count({
      where: {
        officeId,
        status: 'waiting'
      }
    });
    
    let estimatedWait;
    if (groupType === 'individual') {
      estimatedWait = waitingCount * 5; // 5 min per person
    } else if (groupType === 'group') {
      estimatedWait = Math.ceil(waitingCount / 3) * 10; // Groups of ~3, 10 min each
    } else { // section
      estimatedWait = Math.ceil(waitingCount / 30) * 30; // Sections of ~30, 30 min each
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
    
    broadcast('queue_update', { officeId, action: 'join', studentId, queueNumber, groupType });
    
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
      where: {
        officeId,
        status: 'waiting'
      },
      orderBy: {
        queueNumber: 'asc'
      }
    });
    
    const current = await prisma.queue.findFirst({
      where: {
        officeId,
        status: 'serving'
      }
    });
    
    // Get office settings for wait time calculation
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
      where: {
        officeId,
        status: 'serving'
      },
      data: {
        status: 'completed'
      }
    });
    
    // Get next in queue
    const waiting = await prisma.queue.findMany({
      where: {
        officeId,
        status: 'waiting'
      },
      orderBy: {
        queueNumber: 'asc'
      },
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
      
      broadcast('queue_update', { officeId, action: 'call', student });
      
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
      where: {
        officeId,
        studentId
      },
      data: {
        status: 'completed'
      }
    });
    
    broadcast('queue_update', { officeId, action: 'complete', studentId });
    
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
    
    broadcast('settings_update', { officeId, settings });
    
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

const PORT = process.env.PORT || 3001;

// Run migration then start server
runMigration().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Database: PostgreSQL with Prisma');
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
