
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { INSTITUTE_COORDINATES } from '@/utils/locationUtils';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

const teacherEmail = localStorage.getItem("teacherEmail");



const RadiusVerificationPage = () => {
  const [radiusInput, setRadiusInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { setRadiusVerified } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const radius = parseFloat(radiusInput);
    
    if (isNaN(radius) || radius < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid radius in meters (0 or greater).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send radius to backend
      await fetch('http://localhost:5000/api/radius', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: teacherEmail, // replace with actual logged-in name if available
          meters: radius,
        }),
      });
      console.log('Radius submitted to backend:', radius);
      
      setRadiusVerified(true);
      
      toast({
        title: "Radius Submitted Successfully!",
        description: `Your radius of ${radius}m has been recorded.`,
      });
      
      // Proceed to attendance page
      navigate('/attendance');
      
    } catch (error) {
      console.error('Error submitting radius:', error);
      toast({
        title: "Submission Error",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <MapPin className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Radius Verification</CardTitle>
          <CardDescription className="text-lg">
            Please enter your radius from the institute in meters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Institute Location Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Navigation className="h-4 w-4" />
              <span className="font-medium">Institute Location:</span>
            </div>
            <div className="ml-6 space-y-2">
              <p className="text-sm text-gray-800">
                Vishnu Kalpa, Amar Co-Operative Society,<br />
                Madhapur, Hyderabad, Telangana 500033
              </p>
              <p className="text-sm text-gray-800">
                {INSTITUTE_COORDINATES.latitude.toFixed(6)}, {INSTITUTE_COORDINATES.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Radius Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="radius" className="text-sm font-medium text-gray-700">
                Enter Radius (in meters)
              </label>
              <Input
                id="radius"
                type="number"
                min="0"
                step="1"
                placeholder="Enter radius in meters (e.g., 100)"
                value={radiusInput}
                onChange={(e) => setRadiusInput(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Enter your distance from the institute in meters (0 or greater)
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
                  Submitting...
                </>
              ) : (
                'Submit Radius'
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This information will be stored for attendance verification purposes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RadiusVerificationPage;
