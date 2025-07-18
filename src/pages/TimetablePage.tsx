
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentDayTimetable } from '@/data/timetableData';
import { Calendar, Clock, BookOpen, MapPin, Home } from 'lucide-react';

const TimetablePage = () => {
  const navigate = useNavigate();
  const timetable = getCurrentDayTimetable();
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return timetable.findIndex(entry => {
      const [startTime] = entry.time.split(' - ');
      const [time, period] = startTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let startMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) startMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) startMinutes = minutes;
      
      const endMinutes = startMinutes + 60; // Assuming 1-hour classes
      
      return currentTime >= startMinutes && currentTime <= endMinutes;
    });
  };

  const currentSlotIndex = getCurrentTimeSlot();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-3xl font-bold">Today's Timetable</CardTitle>
            </div>
            <CardDescription className="text-lg">
              {today}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Timetable Content */}
        {timetable.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Classes Today</h3>
              <p className="text-gray-500 mb-6">
                You don't have any scheduled classes for today. Enjoy your day off!
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {timetable.map((entry, index) => (
              <Card 
                key={entry.id} 
                className={`transition-all duration-200 ${
                  index === currentSlotIndex 
                    ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
                    : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Time and Current Indicator */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-lg">{entry.time}</span>
                        {index === currentSlotIndex && (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Class Details */}
                    <div className="flex-1 md:mx-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Class</p>
                            <p className="font-semibold">{entry.class}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Subject</p>
                            <p className="font-semibold text-blue-700">{entry.subject}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Room</p>
                            <p className="font-semibold">{entry.roomNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-end">
                      {index === currentSlotIndex ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Now
                        </Badge>
                      ) : index < currentSlotIndex ? (
                        <Badge variant="secondary">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="flex-1"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/attendance')} 
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Clock className="mr-2 h-4 w-4" />
            Check Attendance
          </Button>
        </div>

        {/* Summary Info */}
        {timetable.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Total Classes Today: <span className="font-semibold">{timetable.length}</span></span>
                <span>
                  {currentSlotIndex >= 0 
                    ? `${currentSlotIndex + 1} of ${timetable.length} completed`
                    : 'All classes pending'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;
