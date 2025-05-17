'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SOSButton } from '@/components/sos-button';
import { useToast } from '@/hooks/use-toast';
import { MapView } from '@/components/map-view';
import { useAuth } from '../layout';
import { getPendingReports, handleAssignment } from '@/lib/api';
import { connectSocket, onNewReport, sendLocationUpdate, disconnectSocket } from '@/lib/socket';
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
  const { token, role, userId, logout } = useAuth();

  useEffect(() => {
    if (!token || !role || !userId) {
      router.push('/login');
      return;
    }

    // Get user's location
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
          toast({
            title: 'Location Detected',
            description: 'Your current location has been successfully detected.',
          });
          if (role === 'Responder') {
            sendLocationUpdate(userId, position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Unable to get your location. Please enable location services.',
          });
        },
        { enableHighAccuracy: true }
      );

      // Watch position for Responders
      if (role === 'Responder') {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            sendLocationUpdate(userId, position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('Error watching location:', error);
          },
          { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
      }
    }

    // Fetch pending reports and set up socket for Responders
    if (role === 'Responder' && token) {
      const socket = connectSocket(token);
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

      return () => {
        disconnectSocket();
      };
    }

    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast, router, token, role, userId]);

  const handleSOS = () => {
    router.push('/report-incident');
  };

  const handleBookAmbulance = () => {
    router.push('/book-ambulance');
  };

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

  if (!token || !role || !userId) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/90 backdrop-blur-md px-6 shadow-sm">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full bg-red-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
              </div>
              <h1 className="text-xl font-bold text-red-600">Respondr Dashboard</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              {location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4 text-red-600" />
                  <span className="hidden md:inline">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                </div>
              )}
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
              >
                Logout
              </Button>
            </div>
          </header>

          <main className="p-6 max-w-7xl mx-auto">
            <AnimatedSection>
              {showWelcome && (
                <Card className="mb-6 bg-white rounded-2xl border-0 shadow-lg animate-fade-in-down">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Welcome to Respondr</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {role === 'Public'
                            ? 'Report emergencies or book ambulances with ease.'
                            : 'Monitor and respond to emergency reports in real-time.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {role === 'Public' ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="overflow-hidden shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      <MapView location={location} isLocating={isLocating} />
                    </CardContent>
                  </Card>
                  <div className="grid gap-6">
                    <SOSButton onClick={handleSOS} className="h-40 rounded-2xl" />
                    <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <AlertTriangle className="h-14 w-14 text-red-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Report Incident</h3>
                          <p className="text-sm text-gray-600 mt-1">Capture and report emergencies instantly.</p>
                        </div>
                        <Button
                          onClick={() => router.push('/report-incident')}
                          className="w-full bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          Report Now
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <MapPin className="h-14 w-14 text-red-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Book Ambulance</h3>
                          <p className="text-sm text-gray-600 mt-1">Request an ambulance to your location.</p>
                        </div>
                        <Button
                          onClick={handleBookAmbulance}
                          variant="outline"
                          className="w-full border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  <Card className="overflow-hidden shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      <MapView location={location} isLocating={isLocating} />
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {notifications.length === 0 ? (
                        <p className="text-gray-600 text-center">No new reports.</p>
                      ) : (
                        <ul className="space-y-4">
                          {notifications.map((n) => (
                            <li key={n.reportId} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
                              <p className="text-gray-800 font-medium">
                                New {n.type} at ({n.latitude.toFixed(6)}, {n.longitude.toFixed(6)})
                              </p>
                              {n.photoUrl && (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${n.photoUrl}`}
                                  alt="Incident"
                                  className="mt-2 w-40 rounded-lg shadow"
                                />
                              )}
                              {n.description && <p className="text-gray-600 mt-2 text-sm">{n.description}</p>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">Pending Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reports.length === 0 ? (
                        <p className="text-gray-600 text-center">No pending assignments.</p>
                      ) : (
                        <ul className="space-y-4">
                          {reports.map((r) => (
                            <li key={r.report_id} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
                              <p className="text-gray-800 font-medium">
                                {r.type} at ({r.latitude.toFixed(6)}, {r.longitude.toFixed(6)})
                              </p>
                              {r.photo_url && (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${r.photo_url}`}
                                  alt="Incident"
                                  className="mt-2 w-40 rounded-lg shadow"
                                />
                              )}
                              {r.description && <p className="text-gray-600 mt-2 text-sm">{r.description}</p>}
                              <div className="mt-4 flex gap-2">
                                <Button
                                  onClick={() => handleAssignmentAction(r.report_id, 'accept')}
                                  className="bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 hover:scale-105"
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() => handleAssignmentAction(r.report_id, 'cancel')}
                                  variant="outline"
                                  className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </AnimatedSection>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}