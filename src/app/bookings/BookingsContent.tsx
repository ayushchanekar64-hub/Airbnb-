'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, DollarSign, Search, CheckCircle, Download } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: string;
  listing: {
    id: string;
    title: string;
    location: string;
    image: string;
    pricePerNight: number;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest: {
    name: string;
    email: string;
  };
  createdAt: string;
  paymentMethod?: string;
  paymentId?: string;
}

export default function BookingsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSlipDownload, setShowSlipDownload] = useState(false);

  // Download payment slip function
  const downloadPaymentSlip = (bookingId: string) => {
    console.log('Attempting to download slip for booking:', bookingId);
    const slipData = localStorage.getItem(`paymentSlip_${bookingId}`);
    console.log('Slip data found:', slipData);
    
    if (slipData) {
      try {
        const slip = JSON.parse(slipData);
        console.log('Parsed slip:', slip);
        
        // Create slip content
        const slipContent = `
PAYMENT SLIP
================
Booking ID: ${slip.id}
Property: ${slip.listing.title}
Location: ${slip.listing.location}
Check-in: ${slip.checkIn}
Check-out: ${slip.checkOut}
Total Amount: $${slip.totalPrice}
Payment Method: ${slip.paymentDetails.method.toUpperCase()}
${slip.paymentDetails.cardLast4 ? `Card Ending: ****${slip.paymentDetails.cardLast4}` : ''}
${slip.paymentDetails.upiId ? `UPI ID: ${slip.paymentDetails.upiId}` : ''}
Payment Date: ${new Date(slip.paymentDetails.processedAt).toLocaleString()}
Status: CONFIRMED
================
Thank you for booking with StayEase!
      `.trim();
        
        // Create and download file
        const blob = new Blob([slipContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payment_slip_${bookingId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('Download initiated successfully');
      } catch (error) {
        console.error('Error processing slip:', error);
        alert('Error downloading payment slip. Please try again.');
      }
    } else {
      console.log('No slip data found for booking:', bookingId);
      alert('Payment slip not available for this booking.');
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const success = searchParams.get('success');
        
        if (success === 'true') {
          const savedBooking = sessionStorage.getItem('lastBooking');
          if (savedBooking) {
            try {
              const booking = JSON.parse(savedBooking);
              setLastBooking(booking);
              setShowSuccess(true);
              sessionStorage.removeItem('lastBooking');
              window.history.replaceState({}, '', '/bookings');
              setTimeout(() => setShowSuccess(false), 5000);
            } catch (error) {
              console.error('Error parsing booking:', error);
            }
          }
        }

        // Get bookings from localStorage or use mock data
        const savedBookings = localStorage.getItem('userBookings');
        let allBookings: Booking[] = [];
        
        if (savedBookings) {
          try {
            allBookings = JSON.parse(savedBookings);
          } catch (e) {
            console.error('Error parsing saved bookings:', e);
            allBookings = [];
          }
        }
        
        // Add mock data if no saved bookings
        if (allBookings.length === 0) {
          allBookings = [
            {
              id: '1',
              listing: {
                id: '1',
                title: 'Cozy Mountain Cabin',
                location: 'Aspen, CO',
                image: 'https://images.unsplash.com/photo-1571003123894-1fba9c8cd528?w=800&auto=format&fit=crop',
                pricePerNight: 450
              },
              checkIn: '2024-01-05',
              checkOut: '2024-01-08',
              totalPrice: 540,
              status: 'completed',
              guest: {
                name: user?.name || 'Test User',
                email: user?.email || 'test@example.com'
              },
              createdAt: '2023-12-20'
            }
          ];
          
          // Create mock payment slip for this booking
          const mockSlip = {
            ...allBookings[0],
            paymentDetails: {
              method: 'card',
              cardLast4: '1234',
              upiId: null,
              processedAt: new Date().toISOString()
            }
          };
          localStorage.setItem(`paymentSlip_${allBookings[0].id}`, JSON.stringify(mockSlip));
        }

        setBookings(allBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-900 text-green-300 border border-green-700';
      case 'pending': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      case 'cancelled': return 'bg-red-900 text-red-300 border border-red-700';
      case 'completed': return 'bg-blue-900 text-blue-300 border border-blue-700';
      default: return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Please Log In</h1>
          <p className="mb-4 text-gray-300">You need to be logged in to view your bookings.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {showSuccess && lastBooking && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Card className="bg-green-900 border-green-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Payment Successful!</h3>
                  <div className="space-y-2 text-sm text-green-200">
                    <p><strong>Booking ID:</strong> {lastBooking.id}</p>
                    <p><strong>Property:</strong> {lastBooking.listing.title}</p>
                    <p><strong>Total Paid:</strong> ${lastBooking.totalPrice}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="bg-green-700 hover:bg-green-600" onClick={() => setShowSuccess(false)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <p className="mt-2 text-gray-300">View and manage your upcoming trips</p>
        </div>

        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {filteredBookings.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2 text-white">No bookings found</h2>
              <p className="text-gray-300">
                {searchTerm || filter !== 'all' ? 'Try adjusting your search or filters' : 'You haven\'t made any bookings yet'}
              </p>
              <Link href="/listings" className="inline-block mt-4">
                <Button>Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={booking.listing.image}
                        alt={booking.listing.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors">
                            {booking.listing.title}
                          </h3>
                          <p className="text-sm flex items-center mt-1 text-gray-300">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.listing.location}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <div>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</div>
                            <div>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span className="font-semibold text-white">${booking.totalPrice}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-300">
                          <User className="h-4 w-4 mr-2" />
                          <span>{booking.guest.name}</span>
                          <span className="ml-2 text-gray-400">({booking.guest.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadPaymentSlip(booking.id)}
                            className="flex items-center gap-1 text-xs"
                          >
                            <Download className="h-3 w-3" />
                            Slip
                          </Button>
                          <div className="text-xs text-gray-400">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
