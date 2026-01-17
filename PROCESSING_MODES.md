# Student-Driven Processing Modes

## The Real-World Problem

During enrollment, students don't all come individually. Some come:
- **Alone** - Individual processing
- **With friends** - Small groups (2-5 people)  
- **With their whole section** - 20-40 students together for orientations/briefings

This affects queue wait times dramatically!

## Solution: Students Choose Their Mode

When joining a queue, **students indicate how they're enrolling**:

### 👤 Just Me (Individual)
- Processing alone
- Fastest for single students
- ~5 minutes per person

### 👥 Small Group (2-5 friends)
- Coming with friends
- Processed together
- Enter group size
- ~10 minutes per group

### 👨‍👩‍👧‍👦 Whole Section
- Entire class/section together
- For orientations, briefings, batch processing
- Enter section name (e.g., "BSIT 3-A")
- ~30 minutes per section

## How It Works

### For Students:

1. **Click "Join Queue"** on any office
2. **Modal appears** asking "How are you enrolling?"
3. **Select your mode:**
   - Just Me
   - Small Group (enter size)
   - Whole Section (enter section name)
4. **Get accurate wait time** based on your choice

### For Office Staff:

- **See group type** for each student in queue
- **Know what to expect:**
  - 👤 = One person
  - 👥 = Group of X people
  - 👨‍👩‍👧‍👦 = Section name displayed
- **Process accordingly**

## Benefits

✅ **Accurate wait times** - Calculated based on actual group sizes  
✅ **Better preparation** - Offices know if it's 1 person or 30  
✅ **Flexible** - Handles all real enrollment scenarios  
✅ **Student-driven** - They know best how they're coming  
✅ **Clear communication** - No surprises for office staff

## Examples

### Scenario 1: Individual Student
- **Student:** Clicks "Join Queue" → Selects "Just Me"
- **Queue:** Position #5
- **Wait time:** ~25 minutes (5 × 5 min)
- **Office sees:** 👤 Student 2024001

### Scenario 2: Group of Friends
- **Student:** Clicks "Join Queue" → Selects "Small Group" → Enters "3"
- **Queue:** Position #2
- **Wait time:** ~10 minutes (1 group ahead)
- **Office sees:** 👥 Group of 3 - Student 2024002

### Scenario 3: Whole Section
- **Student:** Clicks "Join Queue" → Selects "Whole Section" → Enters "BSIT 3-A"
- **Queue:** Position #1
- **Wait time:** ~30 minutes (section processing)
- **Office sees:** 👨‍👩‍👧‍👦 Section: BSIT 3-A

## Smart Wait Time Calculation

The system automatically calculates wait times:

```javascript
Individual: position × 5 minutes
Group: Math.ceil(position / 3) × 10 minutes  
Section: Math.ceil(position / 30) × 30 minutes
```

This gives realistic estimates based on how students are actually being processed!

---

**This feature makes EnrollFlow match real enrollment workflows perfectly!**

