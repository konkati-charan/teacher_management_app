
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { getCurrentDayTimetable } from '@/data/timetableData';
import { 
  User, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  BookOpen,
  LogOut,
  Bell,
  Settings
} from 'lucide-react';

const DashboardPage = () => {
  const { teacher, logout, attendanceMarked, radiusVerified } = useAuth();
  const navigate = useNavigate();
  const timetable = getCurrentDayTimetable();
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const getCurrentClass = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return timetable.find(entry => {
      const [startTime] = entry.time.split(' - ');
      const [time, period] = startTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let startMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) startMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) startMinutes = minutes;
      
      const endMinutes = startMinutes + 60;
      
      return currentTime >= startMinutes && currentTime <= endMinutes;
    });
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return timetable.find(entry => {
      const [startTime] = entry.time.split(' - ');
      const [time, period] = startTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let startMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) startMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) startMinutes = minutes;
      
      return currentTime < startMinutes;
    });
  };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out Successfully",
      description: "You have been logged out. Have a great day!",
    });
    navigate('/login');
  };

  const stats = [
    {
      title: 'Attendance Status',
      value: attendanceMarked ? 'Marked' : 'Not Marked',
      icon: attendanceMarked ? CheckCircle : XCircle,
      color: attendanceMarked ? 'text-green-600' : 'text-red-600',
      bgColor: attendanceMarked ? 'bg-green-50' : 'bg-red-50',
      action: () => navigate('/attendance')
    },
    {
      title: 'Location Status',
      value: radiusVerified ? 'Verified' : 'Not Verified',
      icon: radiusVerified ? CheckCircle : MapPin,
      color: radiusVerified ? 'text-green-600' : 'text-orange-600',
      bgColor: radiusVerified ? 'bg-green-50' : 'bg-orange-50',
      action: () => navigate('/radius-verification')
    },
    {
      title: 'Today\'s Classes',
      value: `${timetable.length} Scheduled`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/timetable')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {teacher?.name}!</h1>
            <p className="text-gray-600 mt-1">{today}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={stat.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current/Next Class */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Current Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentClass ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      Live Now
                    </Badge>
                    <span className="text-sm text-gray-600">{currentClass.time}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{currentClass.subject}</p>
                    <p className="text-gray-600">{currentClass.class}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {currentClass.roomNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No class in session</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {nextClass ? 'Next class starts soon' : 'No more classes today'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Next Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextClass ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      Upcoming
                    </Badge>
                    <span className="text-sm text-gray-600">{nextClass.time}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{nextClass.subject}</p>
                    <p className="text-gray-600">{nextClass.class}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {nextClass.roomNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-600">All classes completed</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Great job finishing today's schedule!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Teacher Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900 font-semibold">{teacher?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee ID</label>
                  <p className="text-gray-900 font-semibold">{teacher?.employeeId}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  <p className="text-gray-900 font-semibold">{teacher?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Number</label>
                  <p className="text-gray-900 font-semibold">{teacher?.contactNumber}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => navigate('/attendance')}
                variant="outline" 
                className="h-20 flex-col gap-2"
              >
                <CheckCircle className="h-6 w-6" />
                <span className="text-sm">Attendance</span>
              </Button>
              <Button 
                onClick={() => navigate('/timetable')}
                variant="outline" 
                className="h-20 flex-col gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Timetable</span>
              </Button>
              <Button 
                onClick={() => navigate('/radius-verification')}
                variant="outline" 
                className="h-20 flex-col gap-2"
              >
                <MapPin className="h-6 w-6" />
                <span className="text-sm">Location</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                disabled
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
