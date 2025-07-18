
export interface TimetableEntry {
  id: string;
  time: string;
  class: string;
  subject: string;
  roomNumber: string;
}

export const getCurrentDayTimetable = (): TimetableEntry[] => {
  const today = new Date().getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[today];
  
  // Sample timetable data - this would come from backend in real app
  const timetableData: Record<string, TimetableEntry[]> = {
    Monday: [
      { id: '1', time: '9:00 AM - 10:00 AM', class: '10th Grade A', subject: 'Mathematics', roomNumber: 'Room 101' },
      { id: '2', time: '10:15 AM - 11:15 AM', class: '9th Grade B', subject: 'Physics', roomNumber: 'Room 205' },
      { id: '3', time: '11:30 AM - 12:30 PM', class: '11th Grade C', subject: 'Advanced Math', roomNumber: 'Room 103' },
      { id: '4', time: '1:30 PM - 2:30 PM', class: '10th Grade B', subject: 'Mathematics', roomNumber: 'Room 101' },
      { id: '5', time: '2:45 PM - 3:45 PM', class: '12th Grade A', subject: 'Calculus', roomNumber: 'Room 301' }
    ],
    Tuesday: [
      { id: '6', time: '9:00 AM - 10:00 AM', class: '9th Grade A', subject: 'Algebra', roomNumber: 'Room 102' },
      { id: '7', time: '10:15 AM - 11:15 AM', class: '10th Grade C', subject: 'Geometry', roomNumber: 'Room 104' },
      { id: '8', time: '11:30 AM - 12:30 PM', class: '11th Grade A', subject: 'Trigonometry', roomNumber: 'Room 201' },
      { id: '9', time: '1:30 PM - 2:30 PM', class: '12th Grade B', subject: 'Statistics', roomNumber: 'Room 302' }
    ],
    Wednesday: [
      { id: '10', time: '9:00 AM - 10:00 AM', class: '10th Grade A', subject: 'Mathematics', roomNumber: 'Room 101' },
      { id: '11', time: '10:15 AM - 11:15 AM', class: '9th Grade C', subject: 'Basic Math', roomNumber: 'Room 105' },
      { id: '12', time: '11:30 AM - 12:30 PM', class: '11th Grade B', subject: 'Advanced Math', roomNumber: 'Room 202' },
      { id: '13', time: '1:30 PM - 2:30 PM', class: '12th Grade C', subject: 'Applied Math', roomNumber: 'Room 303' }
    ],
    Thursday: [
      { id: '14', time: '9:00 AM - 10:00 AM', class: '9th Grade B', subject: 'Mathematics', roomNumber: 'Room 102' },
      { id: '15', time: '10:15 AM - 11:15 AM', class: '10th Grade B', subject: 'Geometry', roomNumber: 'Room 103' },
      { id: '16', time: '11:30 AM - 12:30 PM', class: '11th Grade C', subject: 'Calculus Prep', roomNumber: 'Room 203' },
      { id: '17', time: '1:30 PM - 2:30 PM', class: '12th Grade A', subject: 'Advanced Calculus', roomNumber: 'Room 301' }
    ],
    Friday: [
      { id: '18', time: '9:00 AM - 10:00 AM', class: '10th Grade C', subject: 'Mathematics', roomNumber: 'Room 104' },
      { id: '19', time: '10:15 AM - 11:15 AM', class: '9th Grade A', subject: 'Problem Solving', roomNumber: 'Room 106' },
      { id: '20', time: '11:30 AM - 12:30 PM', class: '11th Grade A', subject: 'Math Review', roomNumber: 'Room 201' },
      { id: '21', time: '1:30 PM - 2:30 PM', class: '12th Grade B', subject: 'Exam Prep', roomNumber: 'Room 302' }
    ],
    Saturday: [
      { id: '22', time: '9:00 AM - 11:00 AM', class: 'All Grades', subject: 'Math Club', roomNumber: 'Library' },
      { id: '23', time: '11:15 AM - 12:15 PM', class: 'Teachers', subject: 'Staff Meeting', roomNumber: 'Conference Room' }
    ],
    Sunday: []
  };
  
  return timetableData[currentDay] || [];
};
