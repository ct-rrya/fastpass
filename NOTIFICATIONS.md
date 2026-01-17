# Toast Notification System

## Overview

Students now get real-time toast notifications for all important queue events!

## Notification Types

### 1. ✅ Queue Joined Successfully
**When:** Student joins a queue  
**Shows:**
- Office name
- Queue number (large display)
- Estimated wait time
- Reminder about turn notification

**Duration:** 7 seconds

### 2. 🔔 It's Your Turn!
**When:** Office calls the student's queue number  
**Shows:**
- Alert that it's their turn
- Instruction to proceed to office

**Duration:** 8 seconds  
**Type:** Info (blue)

### 3. ✅ Step Completed
**When:** Office marks student's requirement as complete  
**Shows:**
- Confirmation of completion
- Step is now checked off

**Duration:** 5 seconds

### 4. ❌ Error Notifications
**When:** Something goes wrong (network error, etc.)  
**Shows:**
- Error message
- Suggestion to try again

**Duration:** 4 seconds  
**Type:** Error (red)

## Queue Position Tracking

### Live Position Display
- Shows in the queue card for each office
- Updates every 10 seconds automatically
- Updates immediately on queue changes

**Display:**
- "You're next!" - When position = 0
- "3 ahead" - When 3 people ahead in queue
- Badge shows position prominently

### Real-Time Updates
- WebSocket connection for instant updates
- No need to refresh page
- Works across all tabs

## Visual Design

### Toast Appearance
- **Position:** Top-right on desktop, full-width on mobile
- **Animation:** Slides in from top
- **Colors:**
  - Success: Green
  - Info: Blue
  - Warning: Yellow
  - Error: Red
- **Auto-dismiss:** Closes after duration
- **Manual close:** X button in top-right

### Queue Position Badge
- **Location:** Inside queue card
- **Colors:** Blue background
- **Updates:** Real-time
- **States:**
  - Waiting: Shows number ahead
  - Next: Special "You're next!" message

## Technical Features

### Toast Hook (`useToast`)
```javascript
const { toasts, showToast, hideToast } = useToast();

// Show toast
showToast(message, type, duration);

// Types: 'success', 'info', 'warning', 'error'
// Duration: milliseconds (default 4000)
```

### Real-Time Updates
- WebSocket connection to server
- Event-driven architecture
- Automatic reconnection on disconnect
- Broadcasts to all connected clients

### Position Calculation
- Fetches queue data every 10 seconds
- Calculates position based on queue order
- Updates enrollment state
- Triggers re-render with new position

## User Experience Benefits

✅ **Immediate feedback** - Know instantly when joined  
✅ **No guessing** - See exact position in queue  
✅ **Proactive alerts** - Notified when turn is near  
✅ **Peace of mind** - Confirmation of completed steps  
✅ **Mobile-friendly** - Works great on phones  
✅ **Non-intrusive** - Auto-dismisses after reading  

## Future Enhancements

- **Sound alerts** - Optional audio notification
- **Browser notifications** - Even when tab is inactive
- **SMS notifications** - For students away from device
- **Vibration** - Mobile haptic feedback
- **Custom ringtones** - Personalize alert sounds
- **Notification history** - Review past notifications

---

**Students stay informed every step of the way!** 🎯
