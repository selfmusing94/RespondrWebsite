'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MapView } from '@/components/map-view';
import { SOSButton } from '@/components/sos-button';
import { useAuth } from '@/lib/auth-context';
import { getPendingReports, handleAssignment } from '@/lib/api';
import {
  connectSocket,
  onNewReport,
  sendLocationUpdate,
  disconnectSocket,
} from '@/lib/socket';
import { PendingReport, ReportNotification } from '@/lib/types';
import { AnimatedSection } from '@/components/animated-section';

export default function DashboardPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [notifications, setNotifications] = useState<ReportNotification[]>([]);

  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    setShowWelcome(true);

    const timer = setTimeout(() => setShowWelcome(false), 5000);

    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setIsLocating(false);

          toast({
            title: 'Location Detected',
            description: 'Your current location has been successfully detected.',
          });

          if (user.role === 'Responder') {
            sendLocationUpdate(user.userId, latitude, longitude);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Unable to detect your location. Please enable location services.',
          });
        },
        { enableHighAccuracy: true }
      );

      if (user.role === 'Responder') {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            sendLocationUpdate(user.userId, latitude, longitude);
          },
          (error) => console.error('Watch position error:', error),
          { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
      }
    }

    if (user.role === 'Responder') {
      const socket = connectSocket(localStorage.getItem('token')!);

      onNewReport((report) => {
        setNotifications((prev) => [...prev, report]);
        toast({
          title: `New ${report.type} Report`,
          description: `Location: (${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)})`,
        });
      });

      const fetchReports = async () => {
        try {
          const data = await getPendingReports();
          setReports(data);
        } catch (err: any) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: err.response?.data?.error || 'Failed to fetch reports.',
          });
        }
      };
      fetchReports();

      return () => disconnectSocket();
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, toast]);

  const handleSOS = () => router.push('/report-incident');
  const handleBookAmbulance = () => router.push('/book-ambulance');

  const handleAssignmentAction = async (assignmentId: number, action: 'accept' | 'cancel') => {
    try {
      await handleAssignment(assignmentId, { action });
      setReports((prev) => prev.filter((r) => r.report_id !== assignmentId));
      toast({
        title: `Assignment ${action.charAt(0).toUpperCase() + action.slice(1)}ed`,
        description: `Report ID: ${assignmentId}`,
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.error || 'Action failed.',
      });
    }
  };

  if (!user) return null;

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <AnimatedSection>
        {showWelcome && (
          <Card className="mb-6 bg-white rounded-lg border border-gray-100 shadow-sm p-4 animate-fade-in-down">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Welcome to Respondr</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {user.role === 'Public'
                    ? 'Report emergencies or book ambulances with ease.'
                    : 'Monitor and respond to emergency reports in real-time.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {user.role === 'Public' ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
            <Card className="lg:col-span-3 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 h-[500px]">
              <CardContent className="p-0 h-full">
                <MapView location={location} isLocating={isLocating} />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <SOSButton onClick={handleSOS} />

              <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                  <div>
                    <h3 className="font-medium text-lg">Report Incident</h3>
                    <p className="text-gray-600 text-sm">Need help? Quickly report emergencies here.</p>
                  </div>
                  <Button onClick={handleSOS} variant="destructive" size="lg">
                    Report Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                  <div>
                    <h3 className="font-medium text-lg">Book Ambulance</h3>
                    <p className="text-gray-600 text-sm">Request ambulance service fast and easy.</p>
                  </div>
                  <Button onClick={handleBookAmbulance} variant="outline" size="lg">
                    Book Ambulance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 h-[500px]">
              <CardContent className="p-0 h-full">
                <MapView location={location} isLocating={isLocating} />
              </CardContent>
            </Card>

            {reports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  {reports.map((report) => (
                    <div
                      key={report.report_id}
                      className="mb-3 flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-semibold">{report.type}</p>
                        <p className="text-sm text-gray-600">
                          Location: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAssignmentAction(report.report_id, 'cancel')}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleAssignmentAction(report.report_id, 'accept')}>
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {notifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.map((note, i) => (
                    <p key={i} className="text-sm mb-1">
                      New {note.type} report at {note.latitude.toFixed(6)}, {note.longitude.toFixed(6)}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </AnimatedSection>
    </main>
  );
}
