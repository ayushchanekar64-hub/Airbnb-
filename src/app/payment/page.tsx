'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

interface PaymentData {
  listingId: string;
  listingTitle: string;
  listingImage: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guestName: string;
}

function PaymentContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment form states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const data = searchParams.get('data');
    console.log('Payment page loaded with data:', data);
    
    if (data) {
      try {
        const parsedData = JSON.parse(atob(data));
        console.log('Parsed payment data:', parsedData);
        setPaymentData(parsedData);
      } catch (error) {
        console.error('Invalid payment data:', error);
        router.push('/listings');
      }
    } else {
      console.log('No payment data found, redirecting to listings');
      router.push('/listings');
    }
  }, [searchParams, router]);

  const handlePayment = async () => {
    if (!paymentData || !user) {
      alert('Please log in to continue with payment');
      return;
    }
    
    // Validate payment details
    const newErrors: {[key: string]: string} = {};
    
    if (selectedMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
        newErrors.cardNumber = 'Valid card number required';
      }
      if (!cardDetails.expiry || !cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        newErrors.expiry = 'Valid expiry date required (MM/YY)';
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        newErrors.cvv = 'Valid CVV required';
      }
      if (!cardDetails.name) {
        newErrors.name = 'Cardholder name required';
      }
    }
    
    if (selectedMethod === 'upi') {
      if (!upiId || !upiId.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/)) {
        newErrors.upiId = 'Valid UPI ID required';
      }
    }
    
    if (selectedMethod === 'wallet' && (user.walletBalance || 0) < paymentData.totalPrice) {
      newErrors.wallet = 'Insufficient wallet balance';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsProcessing(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      
      // For now, create a mock booking since backend isn't fully set up
      if (token === 'mock-jwt-token') {
        console.log('=== USING MOCK PAYMENT FLOW ===');
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create mock booking data
        const bookingData = {
          id: `BK${Date.now()}`,
          listing: {
            id: paymentData.listingId,
            title: paymentData.listingTitle,
            location: 'Mock Location',
            image: paymentData.listingImage,
            pricePerNight: paymentData.totalPrice / (Math.ceil((new Date(paymentData.checkOut).getTime() - new Date(paymentData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1)
          },
          checkIn: paymentData.checkIn,
          checkOut: paymentData.checkOut,
          totalPrice: paymentData.totalPrice,
          status: 'confirmed',
          guest: {
            name: user.name || 'Guest',
            email: user.email || 'guest@example.com'
          },
          createdAt: new Date().toISOString(),
          paymentMethod: selectedMethod,
          paymentId: `PAY${Date.now()}`
        };
        
        // Store in sessionStorage for success page
        sessionStorage.setItem('lastBooking', JSON.stringify(bookingData));
        console.log('Stored mock booking in sessionStorage');
        
        // Also save to localStorage for persistence across sessions
        const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        allBookings.push(bookingData);
        localStorage.setItem('userBookings', JSON.stringify(allBookings));
        console.log('Saved booking to localStorage for persistence');
        
        // Generate payment slip
        const paymentSlip = {
          ...bookingData,
          paymentDetails: {
            method: selectedMethod,
            cardLast4: selectedMethod === 'card' ? cardDetails.cardNumber.slice(-4) : null,
            upiId: selectedMethod === 'upi' ? upiId : null,
            processedAt: new Date().toISOString()
          }
        };
        
        // Store payment slip for download
        localStorage.setItem(`paymentSlip_${bookingData.id}`, JSON.stringify(paymentSlip));
        
        // Navigate to bookings page with success state
        router.push('/bookings?success=true&slip=true');
        return;
      }
      
      // Real backend flow (when backend is properly set up)
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: paymentData.listingId,
          checkIn: paymentData.checkIn,
          checkOut: paymentData.checkOut,
          totalPrice: paymentData.totalPrice,
          paymentMethod: selectedMethod,
          paymentId: `PAY${Date.now()}`,
          numGuests: 1,
          specialRequests: ''
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create booking');
      }

      console.log('Booking created successfully:', result.data);
      
      // Store booking data for success page
      const bookingData = {
        id: result.data._id,
        listing: {
          id: result.data.listing._id,
          title: result.data.listing.title,
          location: `${result.data.listing.address.city}, ${result.data.listing.address.country}`,
          image: result.data.listing.images[0]?.url || paymentData.listingImage,
          pricePerNight: result.data.listing.pricePerNight
        },
        checkIn: result.data.checkIn,
        checkOut: result.data.checkOut,
        totalPrice: result.data.totalPrice,
        status: result.data.status,
        guest: {
          name: result.data.guest.name,
          email: result.data.guest.email
        },
        createdAt: result.data.createdAt,
        paymentMethod: result.data.paymentMethod,
        paymentId: result.data.paymentId
      };
      
      // Store in sessionStorage for success page
      sessionStorage.setItem('lastBooking', JSON.stringify(bookingData));
      console.log('Stored booking in sessionStorage');
      
      // Navigate to bookings page with success state
      router.push('/bookings?success=true');
      
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Booking Summary */}
          <div>
            <Card className='bg-gray-800 border-gray-700'>
              <CardHeader>
                <CardTitle className='text-white'>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={paymentData.listingImage} 
                  alt={paymentData.listingTitle}
                  className='aspect-video w-full object-cover rounded-lg mb-4'
                />
                <h3 className='text-xl font-semibold mb-2 text-white'>{paymentData.listingTitle}</h3>
                <div className='space-y-2 text-gray-300'>
                  <p>Check-in: {paymentData.checkIn}</p>
                  <p>Check-out: {paymentData.checkOut}</p>
                  <p>Guest: {paymentData.guestName}</p>
                  <p className='text-2xl font-bold text-indigo-400'>Total: ${paymentData.totalPrice}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card className='bg-gray-800 border-gray-700'>
              <CardHeader>
                <CardTitle className='text-white'>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex gap-2'>
                    <Button
                      variant={selectedMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod('card')}
                      className='flex-1'
                    >
                      <CreditCard className='h-4 w-4 mr-2' />
                      Card
                    </Button>
                    <Button
                      variant={selectedMethod === 'upi' ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod('upi')}
                      className='flex-1'
                    >
                      <Smartphone className='h-4 w-4 mr-2' />
                      UPI
                    </Button>
                    <Button
                      variant={selectedMethod === 'wallet' ? 'default' : 'outline'}
                      onClick={() => setSelectedMethod('wallet')}
                      className='flex-1'
                    >
                      <Wallet className='h-4 w-4 mr-2' />
                      Wallet
                    </Button>
                  </div>

                  {selectedMethod === 'card' && (
                    <div className='space-y-4'>
                      <input
                        type='text'
                        placeholder='Cardholder Name'
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                      />
                      {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                      
                      <input
                        type='text'
                        placeholder='Card Number'
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\s/g, '')})}
                        maxLength={16}
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                      />
                      {errors.cardNumber && <p className="text-red-400 text-sm">{errors.cardNumber}</p>}
                      
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          placeholder='MM/YY'
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          maxLength={5}
                          className='flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                        />
                        {errors.expiry && <p className="text-red-400 text-sm">{errors.expiry}</p>}
                        
                        <input
                          type='text'
                          placeholder='CVV'
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          maxLength={4}
                          className='flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                        />
                        {errors.cvv && <p className="text-red-400 text-sm">{errors.cvv}</p>}
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'upi' && (
                    <div className='space-y-4'>
                      <input
                        type='text'
                        placeholder='UPI ID (e.g., user@upi)'
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                      />
                      {errors.upiId && <p className="text-red-400 text-sm">{errors.upiId}</p>}
                    </div>
                  )}

                  {selectedMethod === 'wallet' && (
                    <div className='space-y-4'>
                      <div className='bg-gray-700 p-4 rounded-lg border border-gray-600'>
                        <p className='text-green-400 font-medium'>Wallet Balance: ${user?.walletBalance || '0.00'}</p>
                        {errors.wallet && <p className="text-red-400 text-sm mt-2">{errors.wallet}</p>}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handlePayment}
                    className='w-full'
                    size='lg'
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay $${paymentData.totalPrice}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-gray-900 flex items-center justify-center text-white'>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

export default PaymentPage;