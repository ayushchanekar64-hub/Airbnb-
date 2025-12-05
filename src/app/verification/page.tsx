'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  Camera,
  FileText,
  User,
  Clock
} from 'lucide-react';

interface VerificationDocument {
  type: 'id_card' | 'passport' | 'drivers_license';
  file: File | null;
  uploaded: boolean;
  verified: boolean;
}

export default function VerificationPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    { type: 'id_card', file: null, uploaded: false, verified: false },
    { type: 'passport', file: null, uploaded: false, verified: false },
    { type: 'drivers_license', file: null, uploaded: false, verified: false }
  ]);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (type: VerificationDocument['type'], file: File) => {
    if (file && file.type.startsWith('image/')) {
      setDocuments(prev => prev.map(doc => 
        doc.type === type 
          ? { ...doc, file, uploaded: true }
          : doc
      ));
    }
  };

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    
    // Mock verification process
    setTimeout(() => {
      setVerificationStatus('pending');
      setIsSubmitting(false);
      
      // Simulate verification completion after 3 seconds
      setTimeout(() => {
        setVerificationStatus('verified');
        setDocuments(prev => prev.map(doc => ({ ...doc, verified: true })));
      }, 3000);
    }, 1000);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'id_card':
        return <User className="h-5 w-5" />;
      case 'passport':
        return <FileText className="h-5 w-5" />;
      case 'drivers_license':
        return <Camera className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getDocumentName = (type: string) => {
    switch (type) {
      case 'id_card':
        return 'ID Card';
      case 'passport':
        return 'Passport';
      case 'drivers_license':
        return "Driver's License";
      default:
        return 'Document';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to verify your identity.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h1>
            <p className="text-gray-600">Verify your identity to increase trust and unlock more features</p>
          </div>

          {/* Verification Status */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Status</h3>
                  <div className="flex items-center gap-2">
                    {verificationStatus === 'verified' && (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </>
                    )}
                    {verificationStatus === 'pending' && (
                      <>
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                      </>
                    )}
                    {verificationStatus === 'rejected' && (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Trust Score</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {verificationStatus === 'verified' ? '95%' : '60%'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits of Verification */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Get Verified?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Higher booking acceptance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Increased trust from guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Faster payment processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Access to premium features</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Verified badge on profile</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {documents.map((doc) => (
                <div key={doc.type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      <span className="font-medium">{getDocumentName(doc.type)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.verified && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {doc.uploaded && !doc.verified && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      {!doc.uploaded && (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <Badge className={
                        doc.verified ? 'bg-green-100 text-green-800' :
                        doc.uploaded ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {doc.verified ? 'Verified' : doc.uploaded ? 'Uploaded' : 'Not Uploaded'}
                      </Badge>
                    </div>
                  </div>
                  
                  {!doc.uploaded && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload {getDocumentName(doc.type)}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Accepted formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                      <Label htmlFor={`upload-${doc.type}`}>
                        <Button variant="outline" className="cursor-pointer">
                          Choose File
                        </Button>
                      </Label>
                      <Input
                        id={`upload-${doc.type}`}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(doc.type, file);
                        }}
                      />
                    </div>
                  )}
                  
                  {doc.uploaded && !doc.verified && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        Document uploaded successfully. Our team will review it within 24-48 hours.
                      </p>
                    </div>
                  )}
                  
                  {doc.verified && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 text-sm">
                        Document verified successfully!
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-6 border-t">
                <Button
                  onClick={handleSubmitVerification}
                  disabled={documents.filter(d => d.uploaded).length === 0 || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Security & Privacy</h4>
                  <p className="text-sm text-gray-600">
                    Your documents are encrypted and stored securely. We only use them for verification purposes 
                    and never share them with third parties. Documents are automatically deleted after verification is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
