'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, DollarSign, Filter, Search, CheckCircle } from 'lucide-react';
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
}

export default function BookingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);

  // Simple theme detection based on system preference
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme') || 'system';
      if (theme === 'dark') {
        setIsDarkTheme(true);
      } else if (theme === 'light') {
        setIsDarkTheme(false);
      } else {
        // System preference
        setIsDarkTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    };
    
    checkTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme);
    return () => window.removeEventListener('change', checkTheme);
  }, []);

  const downloadReceipt = (booking: any) => {
    // Create receipt content
    const receiptContent = `
========================================
           PAYMENT RECEIPT
========================================

Booking ID: ${booking.id}
Payment ID: ${booking.paymentId}
Date: ${new Date(booking.createdAt).toLocaleDateString()}

========================================
GUEST INFORMATION
========================================
Name: ${booking.guest.name}
Email: ${booking.guest.email}

========================================
BOOKING DETAILS
========================================
Property: ${booking.listing.title}
Location: ${booking.listing.location}
Check-in: ${new Date(booking.checkIn).toLocaleDateString()}
Check-out: ${new Date(booking.checkOut).toLocaleDateString()}
Nights: ${Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}

========================================
PAYMENT DETAILS
========================================
Price per Night: $${booking.listing.pricePerNight}
Total Amount: $${booking.totalPrice}
Payment Method: ${booking.paymentMethod?.charAt(0).toUpperCase() + booking.paymentMethod?.slice(1)}
Status: PAID

========================================
Thank you for your booking!
This is a computer-generated receipt.
========================================
    `.trim();

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getThemeClasses = (darkClass: string, lightClass: string) => {
    return isDarkTheme ? darkClass : lightClass;
  };

  useEffect(() => {
    console.log('=== BOOKINGS PAGE LOADED ===');
    console.log('User:', user);
    console.log('User email:', user?.email);
    
    if (!user) {
      console.log('No user found, returning');
      return;
    }

    // Check if coming from successful payment
    const success = searchParams.get('success');
    console.log('Success parameter:', success);
    
    if (success === 'true') {
      console.log('=== PAYMENT SUCCESS DETECTED ===');
      const savedBooking = sessionStorage.getItem('lastBooking');
      console.log('Raw sessionStorage data:', savedBooking);
      
      if (savedBooking) {
        try {
          const booking = JSON.parse(savedBooking);
          console.log('=== PARSED BOOKING DATA ===');
          console.log('Full booking object:', booking);
          console.log('Booking guest email:', booking.guest?.email);
          console.log('Current user email:', user?.email);
          console.log('Emails match:', booking.guest?.email === user?.email);
          
          setLastBooking(booking);
          setShowSuccess(true);
          
          // TEMPORARILY FORCE ADD BOOKING FOR TESTING
          console.log('=== FORCE ADDING BOOKING FOR TESTING ===');
          setBookings(prev => {
            console.log('Previous bookings count:', prev.length);
            console.log('Previous bookings:', prev);
            const newBookings = [booking, ...prev];
            console.log('New bookings count:', newBookings.length);
            console.log('New bookings:', newBookings);
            return newBookings;
          });
          
          // Also check email match for debugging
          if (booking.guest.email === user?.email) {
            console.log('=== EMAILS MATCH ===');
          } else {
            console.log('=== EMAILS DO NOT MATCH ===');
            console.log('Booking email:', booking.guest.email);
            console.log('User email:', user?.email);
          }
          
          // Clear the session storage
          sessionStorage.removeItem('lastBooking');
          
          // Clear the URL parameter
          window.history.replaceState({}, '', '/bookings');
          
          // Hide success message after 5 seconds
          setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
          console.error('Error parsing booking:', error);
        }
      } else {
        console.log('=== NO BOOKING FOUND IN SESSION STORAGE ===');
        // Create a test booking to see if the system works
        const testBooking = {
          id: 'TEST' + Date.now(),
          listing: {
            id: '1',
            title: 'Test Booking - Payment Failed',
            location: 'Test Location',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
            pricePerNight: 350
          },
          checkIn: '2024-02-01',
          checkOut: '2024-02-02',
          totalPrice: 350,
          status: 'confirmed' as const,
          guest: {
            name: user?.name || 'Test User',
            email: user?.email || 'test@example.com'
          },
          createdAt: new Date().toISOString()
        };
        
        console.log('=== ADDING TEST BOOKING ===');
        console.log('Test booking:', testBooking);
        setBookings([testBooking]);
      }
    } else {
      console.log('=== NORMAL BOOKING LOAD ===');
      // Mock data - in real app, fetch from API based on user
      const mockBookings: Booking[] = [
        // User 1: ayush@example.com
        {
          id: '1',
          listing: {
            id: '1',
            title: 'Luxury Penthouse with Ocean View',
            location: 'Miami Beach, FL',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
            pricePerNight: 350
          },
          checkIn: '2024-02-15',
          checkOut: '2024-02-18',
          totalPrice: 360,
          status: 'confirmed',
          guest: {
            name: 'Ayush Kumar',
            email: 'ayush@example.com'
          },
          createdAt: '2024-01-20'
        },
        
        // User 2: ayus@gmail.com (CURRENT USER)
        {
          id: '2',
          listing: {
            id: '2',
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
            name: 'Ayush',
            email: 'ayus@gmail.com'
          },
          createdAt: '2023-12-20'
        },
        {
          id: '3',
          listing: {
            id: '3',
            title: 'Historic European Castle',
            location: 'Edinburgh, Scotland',
            image: 'https://images.unsplash.com/photo-1519214935393-cbe04d1f9b5d?w=800&auto=format&fit=crop',
            pricePerNight: 800
          },
          checkIn: '2024-04-01',
          checkOut: '2024-04-05',
          totalPrice: 1600,
          status: 'confirmed',
          guest: {
            name: 'Ayush',
            email: 'ayus@gmail.com'
          },
          createdAt: '2024-01-28'
        },
        
        // More bookings
        {
          id: '4',
          listing: {
            id: '4',
            title: 'Beachfront Villa Paradise',
            location: 'Malibu, CA',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
            pricePerNight: 650
          },
          checkIn: '2024-03-10',
          checkOut: '2024-03-15',
          totalPrice: 1250,
          status: 'pending',
          guest: {
            name: 'Rahul Sharma',
            email: 'rahul@gmail.com'
          },
          createdAt: '2024-01-25'
        },
        {
          id: '5',
          listing: {
            id: '5',
            title: 'Tokyo Modern Apartment',
            location: 'Tokyo, Japan',
            image: 'https://images.unsplash.com/photo-1515522697127-63e39e76e5d5?w=800&auto=format&fit=crop',
            pricePerNight: 420
          },
          checkIn: '2024-02-20',
          checkOut: '2024-02-25',
          totalPrice: 840,
          status: 'pending',
          guest: {
            name: 'Priya Singh',
            email: 'priya@yahoo.com'
          },
          createdAt: '2024-01-22'
        },
        {
          id: '6',
          listing: {
            id: '6',
            title: 'Tropical Jungle Retreat',
            location: 'Costa Rica',
            image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&auto=format&fit=crop',
            pricePerNight: 325
          },
          checkIn: '2024-05-01',
          checkOut: '2024-05-06',
          totalPrice: 975,
          status: 'confirmed',
          guest: {
            name: 'Carlos Rodriguez',
            email: 'carlos@gmail.com'
          },
          createdAt: '2024-01-15'
        },
        {
          id: '7',
          listing: {
            id: '7',
            title: 'Arctic Glass Igloo',
            location: 'Finland',
            image: 'https://images.unsplash.com/photo-1516396182272-dba50b2906a0?w=800&auto=format&fit=crop',
            pricePerNight: 950
          },
          checkIn: '2024-12-20',
          checkOut: '2024-12-23',
          totalPrice: 1900,
          status: 'confirmed',
          guest: {
            name: 'Erik Nordstrom',
            email: 'erik@gmail.com'
          },
          createdAt: '2024-01-10'
        },
        {
          id: '8',
          listing: {
            id: '8',
            title: 'Santorini Cliff House',
            location: 'Greece',
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop',
            pricePerNight: 550
          },
          checkIn: '2024-06-01',
          checkOut: '2024-06-04',
          totalPrice: 1100,
          status: 'pending',
          guest: {
            name: 'Elena Papadopoulos',
            email: 'elena@gmail.com'
          },
          createdAt: '2024-01-08'
        },
        {
          id: '9',
          listing: {
            id: '9',
            title: 'Swiss Alpine Chalet',
            location: 'Switzerland',
            image: 'https://images.unsplash.com/photo-1542718615-a1c98db2d836?w=800&auto=format&fit=crop',
            pricePerNight: 680
          },
          checkIn: '2024-07-10',
          checkOut: '2024-07-15',
          totalPrice: 2040,
          status: 'confirmed',
          guest: {
            name: 'Hans Mueller',
            email: 'hans@gmail.com'
          },
          createdAt: '2024-01-05'
        },
        {
          id: '10',
          listing: {
            id: '10',
            title: 'Dubai Luxury Suite',
            location: 'Dubai',
            image: 'https://images.unsplash.com/photo-1586102492144-f4ad72ab7711?w=800&auto=format&fit=crop',
            pricePerNight: 750
          },
          checkIn: '2024-08-01',
          checkOut: '2024-08-03',
          totalPrice: 900,
          status: 'pending',
          guest: {
            name: 'Ahmed Al-Fahim',
            email: 'ahmed@gmail.com'
          },
          createdAt: '2024-01-03'
        },
        {
          id: '11',
          listing: {
            id: '11',
            title: 'Desert Oasis Villa',
            location: 'Arizona',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
            pricePerNight: 275
          },
          checkIn: '2024-09-15',
          checkOut: '2024-09-18',
          totalPrice: 550,
          status: 'confirmed',
          guest: {
            name: 'Maria Garcia',
            email: 'maria@gmail.com'
          },
          createdAt: '2024-01-01'
        }
      ];

      // Show only user's bookings (restore user filter)
      const userBookings = mockBookings.filter(booking => 
        booking.guest.email === user?.email
      );

      console.log('Current user email:', user?.email);
      console.log('Filtered bookings for user:', userBookings);
      console.log('UserBookings length:', userBookings.length);
      
      setBookings(userBookings);
      console.log('After setBookings called');
    }
    
    setLoading(false);
    console.log('=== BOOKINGS PAGE LOAD COMPLETE ===');
  }, [user, searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900 text-green-300 border border-green-700';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      case 'cancelled':
        return 'bg-red-900 text-red-300 border border-red-700';
      case 'completed':
        return 'bg-blue-900 text-blue-300 border border-blue-700';
      default:
        return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const isHost = user?.role === 'host' || user?.role === 'admin';

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getThemeClasses('bg-gray-900', 'bg-gray-50')}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-2 ${getThemeClasses('text-white', 'text-gray-900')}`}>Please Log In</h1>
          <p className={`mb-4 ${getThemeClasses('text-gray-300', 'text-gray-600')}`}>You need to be logged in to view your bookings.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getThemeClasses('bg-gray-900', 'bg-gray-50')}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeClasses('bg-gray-900', 'bg-gray-50')}`}>
      <Header />
      
      {/* Success Notification */}
      {showSuccess && lastBooking && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Card className="bg-green-900 border-green-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">
                    Payment Successful!
                  </h3>
                  <div className="space-y-2 text-sm text-green-200">
                    <p><strong>Booking ID:</strong> {lastBooking.id}</p>
                    <p><strong>Property:</strong> {lastBooking.listing.title}</p>
                    <p><strong>Total Paid:</strong> ${lastBooking.totalPrice}</p>
                    <p><strong>Payment Method:</strong> {lastBooking.paymentMethod?.charAt(0).toUpperCase() + lastBooking.paymentMethod?.slice(1)}</p>
                    <p><strong>Check-in:</strong> {new Date(lastBooking.checkIn).toLocaleDateString()}</p>
                    <p><strong>Check-out:</strong> {new Date(lastBooking.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/listings/${lastBooking.listing.id}`}>
                      <Button size="sm" className="bg-green-700 hover:bg-green-600">
                        View Property
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      className="bg-blue-700 hover:bg-blue-600"
                      onClick={() => downloadReceipt(lastBooking)}
                    >
                      Download Receipt
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-600 text-green-300 hover:bg-green-800"
                      onClick={() => setShowSuccess(false)}
                    >
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
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${getThemeClasses('text-white', 'text-gray-900')}`}>
            {isHost ? 'Booking Requests' : 'My Bookings'}
          </h1>
          <p className={`mt-2 ${getThemeClasses('text-gray-300', 'text-gray-600')}`}>
            {isHost ? 'Manage booking requests from guests' : 'View and manage your upcoming trips'}
          </p>
        </div>

        {/* Filters and Search */}
        <Card className={`mb-6 ${getThemeClasses('bg-gray-800 border-gray-700', 'bg-white border-gray-200')}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getThemeClasses('text-gray-400', 'text-gray-500')}`} />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getThemeClasses('bg-gray-700 border-gray-600 text-white placeholder-gray-400', 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getThemeClasses('bg-gray-700 border-gray-600 text-white', 'bg-white border-gray-300 text-gray-900')}`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className={getThemeClasses('bg-gray-800 border-gray-700', 'bg-white border-gray-200')}>
            <CardContent className="p-12 text-center">
              <Calendar className={`h-16 w-16 mx-auto mb-4 ${getThemeClasses('text-gray-400', 'text-gray-300')}`} />
              <h2 className={`text-xl font-semibold mb-2 ${getThemeClasses('text-white', 'text-gray-900')}`}>No bookings found</h2>
              <p className={getThemeClasses('text-gray-300', 'text-gray-600')}>
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : isHost 
                    ? 'You haven\'t received any booking requests yet'
                    : 'You haven\'t made any bookings yet'
                }
              </p>
              {!isHost && (
                <Link href="/listings" className="inline-block mt-4">
                  <Button>Browse Properties</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className={`hover:shadow-md transition-shadow ${getThemeClasses('bg-gray-800 border-gray-700', 'bg-white border-gray-200')}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Property Image */}
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={booking.listing.image}
                        alt={booking.listing.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Link href={`/listings/${booking.listing.id}`}>
                            <h3 className={`text-lg font-semibold hover:text-indigo-400 transition-colors ${getThemeClasses('text-white', 'text-gray-900')}`}>
                              {booking.listing.title}
                            </h3>
                          </Link>
                          <p className={`text-sm flex items-center mt-1 ${getThemeClasses('text-gray-300', 'text-gray-600')}`}>
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.listing.location}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className={`flex items-center text-sm ${getThemeClasses('text-gray-300', 'text-gray-600')}`}>
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <div>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</div>
                            <div>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className={`flex items-center text-sm ${getThemeClasses('text-gray-300', 'text-gray-600')}`}>
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                          </span>
                        </div>
                        <div className={`flex items-center text-sm ${getThemeClasses('text-gray-300', 'text-gray-600')}`}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span className={`font-semibold ${getThemeClasses('text-white', 'text-gray-900')}`}>${booking.totalPrice}</span>
                        </div>
                      </div>

                      {/* Guest/Host Info */}
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center text-sm ${getThemeClasses('text-gray-300', 'text-gray-600')}`}>
                          <User className="h-4 w-4 mr-2" />
                          <span>
                            {isHost ? `Guest: ${booking.guest.name}` : `Host: ${booking.guest.name}`}
                          </span>
                          <span className={`ml-2 ${getThemeClasses('text-gray-400', 'text-gray-500')}`}>({booking.guest.email})</span>
                        </div>
                        <div className={`text-xs ${getThemeClasses('text-gray-400', 'text-gray-500')}`}>
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
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
