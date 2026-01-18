const API_BASE = import.meta.env.PROD 
  ? 'https://fastpass-backend-two.vercel.app/api'
  : '/api';

async function fetchWithOffline(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // If offline, try to get from cache
    if (!navigator.onLine) {
      const cached = localStorage.getItem(`cache_${url}`);
      if (cached) {
        return JSON.parse(cached);
      }
    }
    throw error;
  }
}

export async function getEnrollmentStatus(studentId) {
  const data = await fetchWithOffline(`/enrollment/${studentId}`);
  localStorage.setItem(`cache_/enrollment/${studentId}`, JSON.stringify(data));
  return data;
}

export async function joinQueue(studentId, officeId, queueInfo) {
  return await fetchWithOffline('/queue/join', {
    method: 'POST',
    body: JSON.stringify({ 
      studentId, 
      officeId,
      groupType: queueInfo.groupType,
      groupSize: queueInfo.groupSize,
      sectionName: queueInfo.sectionName
    })
  });
}

export async function getOfficeQueue(officeId) {
  const data = await fetchWithOffline(`/queue/${officeId}`);
  localStorage.setItem(`cache_/queue/${officeId}`, JSON.stringify(data));
  return data;
}

export async function callNextStudent(officeId) {
  return await fetchWithOffline('/queue/next', {
    method: 'POST',
    body: JSON.stringify({ officeId })
  });
}

export async function markCompleted(officeId, studentId) {
  return await fetchWithOffline('/enrollment/complete', {
    method: 'POST',
    body: JSON.stringify({ officeId, studentId })
  });
}
