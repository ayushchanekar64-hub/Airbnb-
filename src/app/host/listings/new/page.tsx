'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X, Plus, MapPin, Home, Bed, Bath, Users, DollarSign } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  pricePerNight: string;
  maxGuests: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  propertyType: string;
  amenities: string[];
  houseRules: string[];
  bookingSettings: {
    minNights: string;
    maxNights: string;
    checkInTime: string;
    checkOutTime: string;
    instantBook: boolean;
  };
  cancellationPolicy: string;
}

const amenityOptions = [
  'wifi', 'parking', 'kitchen', 'tv', 'air-conditioning', 'heating',
  'washer', 'dryer', 'pool', 'hot-tub', 'gym', 'elevator',
  'workspace', 'fireplace', 'bbq-grill', 'beach-access', 'ski-in-out'
];

const propertyTypes = [
  'apartment', 'house', 'villa', 'cabin', 'studio', 'condo', 'townhouse', 'loft'
];

const cancellationPolicies = [
  { value: 'flexible', label: 'Flexible (Full refund 1 day before check-in)' },
  { value: 'moderate', label: 'Moderate (Full refund 5 days before check-in)' },
  { value: 'strict', label: 'Strict (Full refund 14 days before check-in)' }
];

export default function NewListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [newRule, setNewRule] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    pricePerNight: '',
    maxGuests: '',
    bedrooms: '',
    beds: '',
    bathrooms: '',
    propertyType: 'apartment',
    amenities: [],
    houseRules: [],
    bookingSettings: {
      minNights: '1',
      maxNights: '30',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      instantBook: false
    },
    cancellationPolicy: 'moderate'
  });

  if (!user || user.role !== 'host') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need host privileges to create a listing.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.') as [keyof FormData, string];
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        houseRules: [...prev.houseRules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedImages(prev => [...prev, ...files].slice(0, 10)); // Max 10 images
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call - in real app, upload to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Listing data:', formData);
      console.log('Images:', uploadedImages);
      
      // Redirect to host dashboard
      router.push('/host/dashboard');
    } catch (error) {
      console.error('Failed to create listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-yellow-400 text-indigo-900' : 'bg-white/20 text-white/60'
                }`}>
                  {num}
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > num ? 'bg-yellow-400' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-white/80">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Details</span>
            <span>Photos & Rules</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-white">Property Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Modern Loft in Downtown"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/50"
                    placeholder="Describe your property..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="propertyType" className="text-white">Property Type</Label>
                  <select
                    id="propertyType"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type} className="bg-indigo-900">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pricePerNight" className="text-white">Price per Night ($)</Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      value={formData.pricePerNight}
                      onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
                      placeholder="100"
                      min="0"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxGuests" className="text-white">Maximum Guests</Label>
                    <Input
                      id="maxGuests"
                      type="number"
                      value={formData.maxGuests}
                      onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                      placeholder="4"
                      min="1"
                      max="20"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="bedrooms" className="text-white">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="2"
                      min="0"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="beds" className="text-white">Beds</Label>
                    <Input
                      id="beds"
                      type="number"
                      value={formData.beds}
                      onChange={(e) => handleInputChange('beds', e.target.value)}
                      placeholder="2"
                      min="0"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms" className="text-white">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="1"
                      min="0"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Location Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="street" className="text-white">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    placeholder="123 Main Street"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city" className="text-white">City</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      placeholder="New York"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-white">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      placeholder="NY"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="country" className="text-white">Country</Label>
                    <Input
                      id="country"
                      value={formData.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      placeholder="United States"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-white">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      placeholder="10001"
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Amenities & Booking Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenityOptions.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded border-white/20 bg-white/10 text-yellow-400 focus:ring-yellow-400"
                        />
                        <span className="text-sm capitalize text-white">
                          {amenity.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Booking Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="minNights" className="text-white">Minimum Nights</Label>
                      <Input
                        id="minNights"
                        type="number"
                        value={formData.bookingSettings.minNights}
                        onChange={(e) => handleInputChange('bookingSettings.minNights', e.target.value)}
                        min="1"
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxNights" className="text-white">Maximum Nights</Label>
                      <Input
                        id="maxNights"
                        type="number"
                        value={formData.bookingSettings.maxNights}
                        onChange={(e) => handleInputChange('bookingSettings.maxNights', e.target.value)}
                        min="1"
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="checkInTime">Check-in Time</Label>
                      <Input
                        id="checkInTime"
                        type="time"
                        value={formData.bookingSettings.checkInTime}
                        onChange={(e) => handleInputChange('bookingSettings.checkInTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOutTime">Check-out Time</Label>
                      <Input
                        id="checkOutTime"
                        type="time"
                        value={formData.bookingSettings.checkOutTime}
                        onChange={(e) => handleInputChange('bookingSettings.checkOutTime', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                    <select
                      id="cancellationPolicy"
                      value={formData.cancellationPolicy}
                      onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {cancellationPolicies.map(policy => (
                        <option key={policy.value} value={policy.value}>
                          {policy.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bookingSettings.instantBook}
                      onChange={(e) => handleInputChange('bookingSettings.instantBook', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Enable Instant Book</span>
                  </label>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Photos & House Rules */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Click to upload or drag and drop
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB (max 10 photos)
                          </span>
                        </label>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Add a house rule"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                    />
                    <Button type="button" onClick={handleAddRule}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.houseRules.length > 0 && (
                    <div className="space-y-2">
                      {formData.houseRules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm">{rule}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Listing'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
