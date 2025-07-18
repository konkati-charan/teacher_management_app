
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

const teacherEmail = localStorage.getItem("teacherEmail");



const AttendancePage = () => {
  const [timeInput, setTimeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  const { markAttendance, attendanceMarked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!timeInput) {
      toast({
        title: "Time Required",
        description: "Please enter a time for attendance.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await fetch('http://localhost:5000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: teacherEmail,
        time: timeInput,
      }),
    });
    console.log('Time submitted to backend:', timeInput);

      
      markAttendance();
      
      toast({
        title: "Attendance Marked Successfully!",
        description: `Your attendance has been recorded at ${timeInput}.`,
      });
      
      // Redirect to timetable after 2 seconds
      setTimeout(() => {
        navigate('/timetable');
      }, 2000);
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error Marking Attendance",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    if (attendanceMarked) {
      return <CheckCircle className="h-16 w-16 text-green-500" />;
    } else {
      return <Clock className="h-16 w-16 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    if (attendanceMarked) {
      return {
        title: 'Attendance Marked!',
        description: 'Your attendance has been successfully recorded for today.'
      };
    } else {
      return {
        title: 'Mark Your Attendance',
        description: 'Please enter the time for your attendance.'
      };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">{statusMessage.title}</CardTitle>
          <CardDescription className="text-lg">
            {statusMessage.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Time Information */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{currentTime}</p>
              <p className="text-sm text-gray-600">{currentDate}</p>
            </div>
          </div>

          {/* Time Input Form */}
          {!attendanceMarked && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Enter Attendance Time
                </label>
                <Input
                  id="time"
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  required
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Select the time for your attendance record
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Marking Attendance...
                  </>
                ) : (
                  'Mark Attendance'
                )}
              </Button>
            </form>
          )}

          {/* Action Buttons for completed attendance */}
          {attendanceMarked && (
            <div className="space-y-3">
              <Button onClick={() => navigate('/timetable')} className="w-full" size="lg">
                View Today's Timetable
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline" 
                className="w-full" 
                size="lg"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* Help Text */}
          {!attendanceMarked && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                This time will be recorded as your attendance for today
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
