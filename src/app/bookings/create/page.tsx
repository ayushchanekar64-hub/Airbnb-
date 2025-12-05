'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Users, 
  Home, 
  Star, 
  MapPin, 
  DollarSign,
  ArrowLeft,
  CreditCard,
  Navigation,
  Search
} from 'lucide-react';

interface BookingData {
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingLocation: string;
  listingPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  nights: number;
}

function BookingCreateContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [userLocation, setUserLocation] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    const listingId = searchParams.get('listingId');
    console.log('Booking page loaded with listingId:', listingId);
    
    if (!listingId) {
      console.log('No listingId found, redirecting to listings');
      router.push('/listings');
      return;
    }

    // Mock listing data (in real app, fetch from API)
    const mockListing = {
      id: listingId,
      title: 'Luxury Penthouse with Ocean View',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      location: 'Miami Beach, FL',
      price: 350,
      rating: 4.9,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6
    };

    // Set default dates (today + 1 week for 3 nights)
    const today = new Date();
    const checkInDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const checkOutDate = new Date(checkInDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const checkInStr = checkInDate.toISOString().split('T')[0];
    const checkOutStr = checkOutDate.toISOString().split('T')[0];
    
    setCheckIn(checkInStr);
    setCheckOut(checkOutStr);
    setGuests(2);

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = 90; // Fixed price

    setBookingData({
      listingId: mockListing.id,
      listingTitle: mockListing.title,
      listingImage: mockListing.image,
      listingLocation: mockListing.location,
      listingPrice: 90, // Fixed price
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests: 2,
      totalPrice: 90, // Fixed price
      nights
    });
  }, [searchParams, router]);

  const handleProceedToPayment = () => {
    if (!bookingData || !user) {
      console.log('Cannot proceed - missing booking data or user');
      return;
    }

    const updatedBookingData = {
      ...bookingData,
      checkIn,
      checkOut,
      guests,
      nights: calculateNights(),
      totalPrice: calculateTotalPrice()
    };

    console.log('Proceeding to payment with data:', updatedBookingData);

    // Encode booking data and redirect to payment
    const encodedData = btoa(JSON.stringify(updatedBookingData));
    console.log('Encoded data:', encodedData);
    router.push(`/payment?data=${encodedData}`);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!bookingData) return 0;
    const nights = calculateNights();
    return nights * bookingData.listingPrice;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get address
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const location = data.city || data.locality || data.principalSubdivision || 'Current Location';
            setUserLocation(location);
            setShowLocationSuggestions(false);
          } catch (error) {
            // Fallback to coordinates
            setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setShowLocationSuggestions(false);
          }
          
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          setUserLocation('Location access denied');
        }
      );
    } else {
      setIsGettingLocation(false);
      setUserLocation('Geolocation not supported');
    }
  };

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en&search=${query}`
      );
      const data = await response.json();
      
      const suggestions = [
        data.city,
        data.locality,
        data.principalSubdivision
      ].filter(Boolean).slice(0, 5);
      
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } catch (error) {
      // Mock suggestions for demo
      const mockSuggestions = [
        'New York, NY',
        'Los Angeles, CA', 
        'Chicago, IL',
        'Houston, TX',
        'Phoenix, AZ'
      ].filter(loc => loc.toLowerCase().includes(query.toLowerCase()));
      
      setLocationSuggestions(mockSuggestions);
      setShowLocationSuggestions(true);
    }
  };

  const selectLocation = (location: string) => {
    setUserLocation(location);
    setShowLocationSuggestions(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to make a booking.</p>
            <Button onClick={() => router.push('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();
  const serviceFee = Math.round(totalPrice * 0.1);
  const finalTotal = totalPrice + serviceFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Confirm Your Booking</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Details */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={bookingData.listingImage}
                      alt={bookingData.listingTitle}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {bookingData.listingTitle}
                      </h2>
                      <div className="flex items-center text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 mr-1 text-red-500" />
                        <span className="font-medium">
                          {bookingData.listingLocation || 'Location not available'}
                        </span>
                      </div>
                      
                      {/* User Location Picker */}
                      <div className="mt-4">
                        <Label className="text-gray-900 font-medium">Your Location</Label>
                        <div className="relative mt-1">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Enter your location or use current location"
                                value={userLocation}
                                onChange={(e) => {
                                  setUserLocation(e.target.value);
                                  searchLocations(e.target.value);
                                }}
                                onFocus={() => setShowLocationSuggestions(true)}
                                className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                              />
                              <Button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={isGettingLocation}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 text-white"
                                size="sm"
                              >
                                <Navigation className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Location Suggestions */}
                          {showLocationSuggestions && locationSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                              {locationSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => selectLocation(suggestion)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-900 flex items-center gap-2"
                                >
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {userLocation && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {userLocation}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{bookingData.listingPrice}</span>
                        </div>
                        <span className="text-gray-600">${bookingData.listingPrice}/night</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Trip</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check-in</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                      {checkIn && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(checkIn)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                      {checkOut && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(checkOut)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <Label htmlFor="guests" className="text-gray-900 font-medium">Number of Guests</Label>
                    <select
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num} className="text-gray-900">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-600 mt-1">Select the number of guests for your stay</p>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property</span>
                        <span className="font-medium">{bookingData.listingTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dates</span>
                        <span className="font-medium">
                          {formatDate(checkIn)} - {formatDate(checkOut)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests</span>
                        <span className="font-medium">{guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nights</span>
                        <span className="font-medium">{nights}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Policy */}
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Free cancellation up to 24 hours before check-in</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">50% refund for cancellations within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">No refund for no-shows</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Breakdown */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Price Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${bookingData.listingPrice} x {nights} nights
                    </span>
                    <span className="font-medium">${totalPrice}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">${serviceFee}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${finalTotal}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Special offer:</strong> Book now and get 10% off your next stay!
                    </p>
                  </div>

                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full"
                    size="lg"
                    disabled={!checkIn || !checkOut || nights <= 0}
                  >
                    Proceed to Payment
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BookingCreateContent />
    </Suspense>
  );
}

export default BookingCreatePage;
