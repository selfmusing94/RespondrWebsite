'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, MapPin, Send, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/animated-section';
import { createReport } from '@/lib/api';
import { useAuth } from '../layout';

export default function ReportIncidentPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: 'Location Detected',
            description: 'Your current location has been set.',
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Unable to get your location. Please enable location services.',
          });
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [toast, router, token]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description: 'Unable to access your camera. Please check permissions.',
      });
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `incident-${Date.now()}.jpeg`, { type: 'image/jpeg' });
            setPhotoFile(file);
            setPhotoURL(URL.createObjectURL(file));
            setPhotoTaken(true);

            // Stop camera stream
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            setCameraActive(false);
          }
        }, 'image/jpeg');
      }
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    setPhotoFile(null);
    setPhotoURL(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!photoFile) {
      toast({
        variant: 'destructive',
        title: 'Photo Required',
        description: 'Please take a photo of the incident.',
      });
      return;
    }

    if (!location) {
      toast({
        variant: 'destructive',
        title: 'Location Required',
        description: 'We need your location to send help.',
      });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data: any = {
        type: 'SOS',
        latitude: location.lat,
        longitude: location.lng,
        description: description || undefined,
        photo: photoFile,
      };
      const response = await createReport(data);
      toast({
        title: 'Report Sent',
        description: `Report ID: ${response.reportId}. Help is on the way.`,
      });
      router.push('/report-success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send report.');
      toast({
        variant: 'destructive',
        title: 'Report Failed',
        description: err.response?.data?.error || 'Failed to send report.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-4">
      <div className="container mx-auto max-w-md">
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        <AnimatedSection>
          <Card className="shadow-2xl rounded-2xl border-0 overflow-hidden">
            <CardHeader className="bg-red-600 text-white p-6">
              <CardTitle className="text-xl font-bold">Report Emergency</CardTitle>
              <CardDescription className="text-red-100">Capture and report an incident instantly</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!cameraActive && !photoTaken ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <Camera className="h-12 w-12 text-red-600" />
                  <p className="text-center text-gray-600">Take a photo to help emergency services</p>
                  <Button
                    onClick={startCamera}
                    className="bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Open Camera
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {cameraActive && !photoTaken && (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg shadow-lg" />
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                        <Button
                          onClick={takePhoto}
                          className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
                        >
                          <Camera className="h-8 w-8" />
                        </Button>
                      </div>
                    </>
                  )}
                  {photoTaken && photoURL && (
                    <div className="relative">
                      <img src={photoURL} alt="Incident" className="w-full h-auto rounded-lg shadow-lg" />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/90 hover:bg-gray-100 rounded-full shadow transition-all duration-300"
                        onClick={retakePhoto}
                      >
                        <X className="h-5 w-5 text-gray-700" />
                      </Button>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
              {location && (
                <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                  <MapPin className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Your Location</p>
                    <p className="text-gray-600">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-900">Incident Description (Optional)</label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-gray-50">
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                disabled={!photoTaken || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Report...
                  </div>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Send Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}