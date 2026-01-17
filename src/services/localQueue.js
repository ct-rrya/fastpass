// Local-only queue management (works completely offline)

const DB_KEY = 'fastpass_local_db';
const OLD_DB_KEY = 'enrollflow_local_db'; // For migration

function getLocalDB() {
  let data = localStorage.getItem(DB_KEY);
  
  // Migration: Check if old data exists
  if (!data) {
    const oldData = localStorage.getItem(OLD_DB_KEY);
    if (oldData) {
      console.log('Migrating data from EnrollFlow to FastPass...');
      localStorage.setItem(DB_KEY, oldData);
      data = oldData;
    }
  }
  
  if (!data) {
    return {
      enrollments: {},
      queues: {},
      queueCounters: {},
      officeQueues: {}
    };
  }
  return JSON.parse(data);
}

function saveLocalDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getLocalEnrollment(studentId) {
  const db = getLocalDB();
  return db.enrollments[studentId] || null;
}

export function saveLocalEnrollment(studentId, enrollment) {
  const db = getLocalDB();
  db.enrollments[studentId] = enrollment;
  saveLocalDB(db);
}

export function joinLocalQueue(studentId, officeId, queueInfo) {
  const db = getLocalDB();
  
  // Initialize office queue if doesn't exist
  if (!db.officeQueues[officeId]) {
    db.officeQueues[officeId] = [];
  }
  
  // Get or create counter
  if (!db.queueCounters[officeId]) {
    db.queueCounters[officeId] = 0;
  }
  
  db.queueCounters[officeId]++;
  const queueNumber = db.queueCounters[officeId];
  
  // Add to queue
  const queueEntry = {
    id: Date.now(),
    studentId,
    queueNumber,
    groupType: queueInfo.groupType,
    groupSize: queueInfo.groupSize,
    sectionName: queueInfo.sectionName,
    status: 'waiting',
    createdAt: Date.now()
  };
  
  db.officeQueues[officeId].push(queueEntry);
  db.queues[`${officeId}_${studentId}`] = queueEntry;
  
  saveLocalDB(db);
  
  // Calculate estimated wait
  const waitingCount = db.officeQueues[officeId].filter(q => q.status === 'waiting').length;
  let estimatedWait = waitingCount * 5;
  
  return { queueNumber, officeId, estimatedWait };
}

export function getLocalOfficeQueue(officeId) {
  const db = getLocalDB();
  const queue = (db.officeQueues[officeId] || [])
    .filter(q => q.status === 'waiting')
    .sort((a, b) => a.queueNumber - b.queueNumber);
  
  const current = (db.officeQueues[officeId] || [])
    .find(q => q.status === 'serving');
  
  return {
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
    } : null
  };
}

export function callLocalNextStudent(officeId) {
  const db = getLocalDB();
  
  if (!db.officeQueues[officeId]) {
    return { student: null };
  }
  
  // Mark current as completed
  db.officeQueues[officeId].forEach(q => {
    if (q.status === 'serving') {
      q.status = 'completed';
    }
  });
  
  // Get next waiting
  const waiting = db.officeQueues[officeId]
    .filter(q => q.status === 'waiting')
    .sort((a, b) => a.queueNumber - b.queueNumber);
  
  if (waiting.length > 0) {
    const next = waiting[0];
    next.status = 'serving';
    
    saveLocalDB(db);
    
    return {
      student: {
        id: next.id,
        studentId: next.studentId,
        queueNumber: next.queueNumber,
        groupType: next.groupType,
        groupSize: next.groupSize,
        sectionName: next.sectionName,
        name: next.sectionName || `Student ${next.studentId}`
      }
    };
  }
  
  saveLocalDB(db);
  return { student: null };
}

export function markLocalCompleted(officeId, studentId) {
  const db = getLocalDB();
  
  // Update enrollment
  if (db.enrollments[studentId]) {
    db.enrollments[studentId].offices = db.enrollments[studentId].offices.map(o =>
      o.id === officeId ? { ...o, status: 'completed' } : o
    );
  }
  
  // Mark queue as completed
  if (db.officeQueues[officeId]) {
    db.officeQueues[officeId].forEach(q => {
      if (q.studentId === studentId) {
        q.status = 'completed';
      }
    });
  }
  
  saveLocalDB(db);
  return { success: true };
}

export function clearLocalDB() {
  localStorage.removeItem(DB_KEY);
}
