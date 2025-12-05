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

  const handlePayment = () => {
    if (!paymentData || !user) {
      alert('Please log in to continue with payment');
      return;
    }
    
    if (selectedMethod === 'wallet' && (user.walletBalance || 0) < paymentData.totalPrice) {
      alert('Insufficient wallet balance');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      
      console.log('Creating booking for user:', user);
      console.log('User email:', user?.email);
      
      // Create booking data
      const bookingData = {
        id: `BK${Date.now()}`,
        listing: {
          id: paymentData.listingId,
          title: paymentData.listingTitle,
          location: 'Location',
          image: paymentData.listingImage,
          pricePerNight: paymentData.totalPrice / (Math.ceil((new Date(paymentData.checkOut).getTime() - new Date(paymentData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1)
        },
        checkIn: paymentData.checkIn,
        checkOut: paymentData.checkOut,
        totalPrice: paymentData.totalPrice,
        status: 'confirmed' as const,
        guest: {
          name: user.name || 'Guest',
          email: user.email || 'guest@example.com'
        },
        createdAt: new Date().toISOString(),
        paymentMethod: selectedMethod,
        paymentId: `PAY${Date.now()}`
      };
      
      console.log('Created booking data:', bookingData);
      
      // Store booking data in sessionStorage for the success page
      sessionStorage.setItem('lastBooking', JSON.stringify(bookingData));
      console.log('Stored booking in sessionStorage');
      
      // Navigate to bookings page with success state
      console.log('Navigating to bookings page...');
      router.push('/bookings?success=true');
    }, 2000);
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
                        placeholder='Card Number'
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                      />
                      <input
                        type='text'
                        placeholder='MM/YY'
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                      />
                      <input
                        type='text'
                        placeholder='CVV'
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                      />
                    </div>
                  )}

                  {selectedMethod === 'upi' && (
                    <div className='space-y-4'>
                      <input
                        type='text'
                        placeholder='UPI ID'
                        className='w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400'
                      />
                    </div>
                  )}

                  {selectedMethod === 'wallet' && (
                    <div className='space-y-4'>
                      <div className='bg-gray-700 p-4 rounded-lg border border-gray-600'>
                        <p className='text-green-400 font-medium'>Wallet Balance: ${user?.walletBalance || '0.00'}</p>
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