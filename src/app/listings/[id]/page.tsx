'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Heart, 
  Wifi, 
  Car, 
  Coffee,
  Tv,
  Wind,
  Dumbbell,
  Home
} from 'lucide-react';
import Header from '@/components/Header';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  numReviews: number;
  images: string[];
  isFavorite: boolean;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  propertyType: string;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    responseRate: number;
  };
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    // Mock data - in real app, this would be an API call
    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Luxury Penthouse with Ocean View',
        description: 'Luxury penthouse with ocean views and modern amenities.',
        price: 350,
        rating: 4.9,
        numReviews: 127,
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        propertyType: 'Entire apartment',
        amenities: ['wifi', 'parking', 'kitchen', 'tv', 'air-conditioning', 'gym'],
        host: {
          name: 'Michael Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
          responseRate: 98
        }
      },
      {
        id: '2',
        title: 'Modern Downtown Loft',
        description: 'Stylish downtown loft with modern amenities and city views.',
        price: 280,
        rating: 4.8,
        numReviews: 89,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 6,
        propertyType: 'Entire apartment',
        amenities: ['wifi', 'parking', 'kitchen', 'tv', 'air-conditioning'],
        host: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop',
          responseRate: 95
        }
      },
      {
        id: '3',
        title: 'Cozy Mountain Cabin',
        description: 'Escape to this charming mountain cabin surrounded by pristine wilderness. Features rustic decor, a stone fireplace, and stunning mountain views. Perfect for nature lovers and weekend getaways.',
        price: 450,
        rating: 4.95,
        numReviews: 203,
        images: [
          'https://images.unsplash.com/photo-1571003123894-1fba9c8cd528?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542718615-a1c98db2d836?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        propertyType: 'Cabin',
        amenities: ['wifi', 'parking', 'kitchen', 'fireplace', 'hiking'],
        host: {
          name: 'David Miller',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
          responseRate: 99
        }
      },
      {
        id: '4',
        title: 'Beachfront Villa Paradise',
        description: 'Luxurious beachfront villa with direct access to pristine sandy beaches. Features infinity pool, outdoor kitchen, and panoramic ocean views. Perfect for luxury vacations and special occasions.',
        price: 650,
        rating: 4.97,
        numReviews: 156,
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1584114627955-e25da2b9db8b?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 5,
        bathrooms: 4,
        maxGuests: 10,
        propertyType: 'Villa',
        amenities: ['wifi', 'parking', 'pool', 'kitchen', 'tv', 'air-conditioning', 'beach-access'],
        host: {
          name: 'Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop',
          responseRate: 97
        }
      },
      {
        id: '5',
        title: 'Historic European Castle',
        description: 'Step back in time in this magnificent medieval castle. Features original stone walls, grand halls, and modern amenities. Experience history and luxury in one unforgettable stay.',
        price: 800,
        rating: 4.93,
        numReviews: 78,
        images: [
          'https://images.unsplash.com/photo-1519214935393-cbe04d1f9b5d?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1549900342-924e46976482?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 6,
        bathrooms: 5,
        maxGuests: 12,
        propertyType: 'Castle',
        amenities: ['wifi', 'parking', 'kitchen', 'tv', 'historic-tours', 'garden'],
        host: {
          name: 'Lord James Harrington',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
          responseRate: 100
        }
      },
      {
        id: '6',
        title: 'Tropical Jungle Retreat',
        description: 'Immerse yourself in nature at this eco-friendly jungle retreat. Features treehouse-style accommodations, wildlife viewing, and guided tours. Perfect for adventure seekers and nature enthusiasts.',
        price: 325,
        rating: 4.85,
        numReviews: 112,
        images: [
          'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        propertyType: 'Eco-lodge',
        amenities: ['wifi', 'parking', 'kitchen', 'nature-tours', 'wildlife-viewing'],
        host: {
          name: 'Carlos Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&auto=format&fit=crop',
          responseRate: 94
        }
      },
      {
        id: '7',
        title: 'Desert Oasis Villa',
        description: 'Discover tranquility in this stunning desert oasis. Features modern architecture, private pool, and breathtaking desert sunset views. Perfect for relaxation and stargazing.',
        price: 275,
        rating: 4.82,
        numReviews: 145,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        propertyType: 'Villa',
        amenities: ['wifi', 'parking', 'pool', 'kitchen', 'tv', 'air-conditioning'],
        host: {
          name: 'Maria Garcia',
          avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&auto=format&fit=crop',
          responseRate: 96
        }
      },
      {
        id: '8',
        title: 'Arctic Glass Igloo',
        description: 'Experience the magic of the northern lights from this unique glass igloo. Features panoramic views, thermal glass, and modern amenities. Perfect for aurora watching and winter adventures.',
        price: 950,
        rating: 4.98,
        numReviews: 67,
        images: [
          'https://images.unsplash.com/photo-1516396182272-dba50b2906a0?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        propertyType: 'Igloo',
        amenities: ['wifi', 'parking', 'heating', 'northern-lights-view', 'thermal-glass'],
        host: {
          name: 'Erik Nordstrom',
          avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&auto=format&fit=crop',
          responseRate: 98
        }
      },
      {
        id: '9',
        title: 'Santorini Cliff House',
        description: 'Romantic cliff house overlooking the stunning caldera. Features traditional Cycladic architecture, private terrace, and spectacular sunset views. Perfect for couples and honeymooners.',
        price: 550,
        rating: 4.91,
        numReviews: 234,
        images: [
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        propertyType: 'House',
        amenities: ['wifi', 'parking', 'kitchen', 'tv', 'air-conditioning', 'sunset-view'],
        host: {
          name: 'Elena Papadopoulos',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop',
          responseRate: 99
        }
      },
      {
        id: '10',
        title: 'Tokyo Modern Apartment',
        description: 'Ultra-modern apartment in the heart of Tokyo. Features cutting-edge technology, city views, and minimalist design. Perfect for tech enthusiasts and urban explorers.',
        price: 420,
        rating: 4.86,
        numReviews: 189,
        images: [
          'https://images.unsplash.com/photo-1515522697127-63e39e76e5d5?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        propertyType: 'Apartment',
        amenities: ['wifi', 'parking', 'kitchen', 'tv', 'high-speed-internet', 'smart-home'],
        host: {
          name: 'Takeshi Yamamoto',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
          responseRate: 97
        }
      },
      {
        id: '11',
        title: 'Swiss Alpine Chalet',
        description: 'Luxurious ski chalet with breathtaking mountain views. Features rustic alpine decor, sauna, and ski-in/ski-out access. Perfect for winter sports enthusiasts and mountain lovers.',
        price: 680,
        rating: 4.94,
        numReviews: 178,
        images: [
          'https://images.unsplash.com/photo-1542718615-a1c98db2d836?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        propertyType: 'Chalet',
        amenities: ['wifi', 'parking', 'kitchen', 'tv', 'sauna', 'ski-access', 'fireplace'],
        host: {
          name: 'Hans Mueller',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
          responseRate: 100
        }
      },
      {
        id: '12',
        title: 'Dubai Luxury Suite',
        description: 'Opulent luxury suite in the heart of Dubai. Features panoramic city views, premium amenities, and world-class service. Perfect for luxury travelers and business executives.',
        price: 750,
        rating: 4.89,
        numReviews: 201,
        images: [
          'https://images.unsplash.com/photo-1586102492144-f4ad72ab7711?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6aafc6044cf0?w=800&auto=format&fit=crop'
        ],
        isFavorite: false,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        propertyType: 'Luxury Suite',
        amenities: ['wifi', 'parking', 'pool', 'kitchen', 'tv', 'air-conditioning', 'concierge', 'city-view'],
        host: {
          name: 'Ahmed Al-Fahim',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
          responseRate: 98
        }
      }
    ];

    const foundListing = mockListings.find(l => l.id === params.id);
    setListing(foundListing || null);
    setLoading(false);
  }, [params.id]);

  const toggleFavorite = () => {
    if (listing) {
      setListing({ ...listing, isFavorite: !listing.isFavorite });
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking.checkIn || !booking.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (!listing) return;
    
    // Calculate nights
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }
    
    // Calculate total price
    const totalPrice = nights * listing.price;
    
    // Prepare payment data
    const paymentData = {
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: nights,
      pricePerNight: listing.price,
      totalPrice: totalPrice,
      guestName: booking.guests.toString()
    };
    
    // Navigate to payment page with encoded data
    const encodedData = btoa(JSON.stringify(paymentData));
    router.push(`/payment?data=${encodedData}`);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-5 w-5" />;
      case 'parking': return <Car className="h-5 w-5" />;
      case 'kitchen': return <Coffee className="h-5 w-5" />;
      case 'tv': return <Tv className="h-5 w-5" />;
      case 'air-conditioning': return <Wind className="h-5 w-5" />;
      case 'gym': return <Dumbbell className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Listing not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="max-w-6xl mx-auto px-3 py-12">
        {/* Property Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6">{listing.title}</h1>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-lg">{listing.rating}</span>
              <span className="text-gray-400">({listing.numReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-lg">Location</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {listing.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${listing.title} - Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Details */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Bedrooms</span>
                  <p className="font-semibold">{listing.bedrooms}</p>
                </div>
                <div>
                  <span className="text-gray-400">Bathrooms</span>
                  <p className="font-semibold">{listing.bathrooms}</p>
                </div>
                <div>
                  <span className="text-gray-400">Max Guests</span>
                  <p className="font-semibold">{listing.maxGuests}</p>
                </div>
                <div>
                  <span className="text-gray-400">Property Type</span>
                  <p className="font-semibold">{listing.propertyType}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {getAmenityIcon(amenity)}
                    <span className="capitalize">{amenity.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Info */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Host Information</h2>
              <div className="flex items-center gap-4">
                <img
                  src={listing.host.avatar}
                  alt={listing.host.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-semibold">{listing.host.name}</p>
                  <p className="text-gray-400">Response rate: {listing.host.responseRate}%</p>
                </div>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className='bg-black rounded-lg p-4 mb-4 border border-gray-700'>
              <h2 className='text-lg font-bold text-white mb-3 pb-2 border-b border-gray-600'>Detailed Ratings</h2>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700'>
                  <span className='text-white text-sm capitalize'>Cleanliness</span>
                  <span className='text-yellow-400 font-bold text-lg'>5.0</span>
                </div>
                <div className='flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700'>
                  <span className='text-white text-sm capitalize'>Accuracy</span>
                  <span className='text-yellow-400 font-bold text-lg'>5.0</span>
                </div>
                <div className='flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700'>
                  <span className='text-white text-sm capitalize'>Check In</span>
                  <span className='text-yellow-400 font-bold text-lg'>5.0</span>
                </div>
                <div className='flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700'>
                  <span className='text-white text-sm capitalize'>Communication</span>
                  <span className='text-yellow-400 font-bold text-lg'>5.0</span>
                </div>
                <div className='flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700'>
                  <span className='text-white text-sm capitalize'>Location</span>
                  <span className='text-yellow-400 font-bold text-lg'>5.0</span>
                </div>
                <div className='flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700'>
                  <span className='text-white text-sm capitalize'>Value</span>
                  <span className='text-yellow-400 font-bold text-lg'>4.0</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className='bg-black rounded-lg p-4 mb-4 border border-gray-700'>
              <h2 className='text-lg font-bold text-white mb-3 pb-2 border-b border-gray-600'>Reviews</h2>
              
              <div className='bg-black p-3 rounded-lg mb-3 border border-gray-700'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <div className='font-bold text-white mb-1'>Sarah Johnson</div>
                    <div className='text-sm text-gray-400'>2 weeks ago</div>
                  </div>
                  <div className='flex gap-1'>
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                    ))}
                  </div>
                </div>
                <div className='bg-black p-2 rounded-lg mb-2'>
                  <p className='text-white leading-relaxed'>
                    Amazing penthouse with breathtaking ocean views! The place was spotless and had all the amenities we needed. Michael was an excellent host - very responsive and helpful. Would definitely stay here again!
                  </p>
                </div>
                
                <div className='bg-gray-900 p-2 rounded border-l-4 border-blue-500 border border-gray-700'>
                  <div className='text-sm text-blue-400 font-semibold mb-1'>
                    Response from Michael Chen
                  </div>
                  <div className='text-xs text-gray-400 mb-2'>Yesterday</div>
                  <div className='bg-black p-2 rounded'>
                    <p className='text-white text-sm leading-relaxed'>
                      Thank you so much for your wonderful review, Sarah! We're thrilled you enjoyed your stay. Hope to welcome you back soon!
                    </p>
                  </div>
                  <div className='flex gap-4 mt-2'>
                    <button className='text-blue-400 text-sm underline hover:no-underline'>
                      Helpful (23)
                    </button>
                    <button className='text-blue-400 text-sm underline hover:no-underline'>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sticky top-6 border border-gray-700">
              <div className="mb-3">
                <span className="text-2xl font-bold text-white">${listing.price}</span>
                <span className="text-gray-400"> / night</span>
              </div>
              
              <form onSubmit={handleBooking} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <input
                    type="date"
                    value={booking.checkIn}
                    onChange={(e) => setBooking({...booking, checkIn: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <input
                    type="date"
                    value={booking.checkOut}
                    onChange={(e) => setBooking({...booking, checkOut: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={listing.maxGuests}
                    value={booking.guests}
                    onChange={(e) => setBooking({...booking, guests: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
                >
                  Reserve Now
                </button>
              </form>
              
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 text-sm">Max Guests</span>
                  <span className="font-medium text-white">{listing.maxGuests}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 text-sm">Bedrooms</span>
                  <span className="font-medium text-white">{listing.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Bathrooms</span>
                  <span className="font-medium text-white">{listing.bathrooms}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
