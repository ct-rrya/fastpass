import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Simple in-memory database (Railway doesn't persist files)
let db = {
  enrollments: {},
  queues: [],
  queueCounters: {},
  officeSettings: {}
};

// Optional: Load from environment variable if provided
if (process.env.DB_DATA) {
  try {
    db = JSON.parse(process.env.DB_DATA);
  } catch (e) {
    console.log('No initial DB data found, starting fresh');
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
app.get('/api/enrollment/:studentId', (req, res) => {
  const { studentId } = req.params;
  
  if (db.enrollments[studentId]) {
    res.json(db.enrollments[studentId]);
  } else {
    // Initialize new enrollment
    const enrollment = {
      studentId,
      offices: [
        { id: 'department', name: 'Department Office', icon: '🏢', status: 'pending', queueNumber: null },
        { id: 'clinic', name: 'Clinic', icon: '🏥', status: 'pending', queueNumber: null },
        { id: 'nstp', name: 'NSTP Office', icon: '🎖️', status: 'pending', queueNumber: null },
        { id: 'cashier', name: 'Cashier', icon: '💰', status: 'pending', queueNumber: null },
        { id: 'affairs', name: 'Student Affairs', icon: '👥', status: 'pending', queueNumber: null },
        { id: 'mis', name: 'MIS Office', icon: '💻', status: 'pending', queueNumber: null },
        { id: 'registrar', name: 'Registrar', icon: '📋', status: 'pending', queueNumber: null }
      ],
      currentQueue: null
    };
    
    db.enrollments[studentId] = enrollment;
    
    res.json(enrollment);
  }
});

// Join queue
app.post('/api/queue/join', (req, res) => {
  const { studentId, officeId, groupType, groupSize, sectionName } = req.body;
  
  // Get or create counter
  if (!db.queueCounters[officeId]) {
    db.queueCounters[officeId] = 0;
  }
  
  db.queueCounters[officeId]++;
  const queueNumber = db.queueCounters[officeId];
  
  // Calculate estimated wait based on group type
  const waitingCount = db.queues.filter(q => 
    q.officeId === officeId && q.status === 'waiting'
  ).length;
  
  let estimatedWait;
  if (groupType === 'individual') {
    estimatedWait = waitingCount * 5; // 5 min per person
  } else if (groupType === 'group') {
    estimatedWait = Math.ceil(waitingCount / 3) * 10; // Groups of ~3, 10 min each
  } else { // section
    estimatedWait = Math.ceil(waitingCount / 30) * 30; // Sections of ~30, 30 min each
  }
  
  // Add to queue
  db.queues.push({
    id: Date.now(),
    officeId,
    studentId,
    queueNumber,
    groupType,
    groupSize,
    sectionName,
    status: 'waiting',
    createdAt: Date.now()
  });
  
  broadcast('queue_update', { officeId, action: 'join', studentId, queueNumber, groupType });
  
  res.json({ queueNumber, officeId, estimatedWait });
});

// Get office queue
app.get('/api/queue/:officeId', (req, res) => {
  const { officeId } = req.params;
  
  const queue = db.queues
    .filter(q => q.officeId === officeId && q.status === 'waiting')
    .sort((a, b) => a.queueNumber - b.queueNumber);
  
  const current = db.queues.find(q => q.officeId === officeId && q.status === 'serving');
  
  // Get office settings for wait time calculation
  const settings = db.officeSettings[officeId] || { 
    processingMode: 'individual', 
    avgProcessingTime: 5 
  };
  
  res.json({
    queue: queue.map(q => ({
      id: q.id,
      studentId: q.studentId,
      queueNumber: q.queueNumber,
      groupType: q.groupType || 'individual',
      groupSize: q.groupSize || 1,
      sectionName: q.sectionName,
      name: q.sectionName || `Student ${q.studentId}`
    })),
    current: current ? {
      id: current.id,
      studentId: current.studentId,
      queueNumber: current.queueNumber,
      groupType: current.groupType || 'individual',
      groupSize: current.groupSize || 1,
      sectionName: current.sectionName,
      name: current.sectionName || `Student ${current.studentId}`
    } : null,
    settings
  });
});

// Call next student
app.post('/api/queue/next', (req, res) => {
  const { officeId } = req.body;
  
  // Mark current as completed
  db.queues.forEach(q => {
    if (q.officeId === officeId && q.status === 'serving') {
      q.status = 'completed';
    }
  });
  
  // Get next in queue
  const waiting = db.queues
    .filter(q => q.officeId === officeId && q.status === 'waiting')
    .sort((a, b) => a.queueNumber - b.queueNumber);
  
  if (waiting.length > 0) {
    const next = waiting[0];
    next.status = 'serving';
    
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
});

// Mark completed
app.post('/api/enrollment/complete', (req, res) => {
  const { officeId, studentId } = req.body;
  
  // Update enrollment
  if (db.enrollments[studentId]) {
    db.enrollments[studentId].offices = db.enrollments[studentId].offices.map(o =>
      o.id === officeId ? { ...o, status: 'completed' } : o
    );
  }
  
  // Mark queue as completed
  db.queues.forEach(q => {
    if (q.officeId === officeId && q.studentId === studentId) {
      q.status = 'completed';
    }
  });
  
  broadcast('queue_update', { officeId, action: 'complete', studentId });
  
  res.json({ success: true });
});

// Update office settings
app.post('/api/office/settings', (req, res) => {
  const { officeId, settings } = req.body;
  
  db.officeSettings[officeId] = settings;
  
  broadcast('settings_update', { officeId, settings });
  
  res.json({ success: true });
});

// Get office settings
app.get('/api/office/settings/:officeId', (req, res) => {
  const { officeId } = req.params;
  const settings = db.officeSettings[officeId] || {
    processingMode: 'individual',
    avgProcessingTime: 5
  };
  res.json(settings);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
