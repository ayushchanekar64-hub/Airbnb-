'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Heart, 
  Home as HomeIcon,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Dumbbell,
  Globe,
  Shield,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Filter,
  MapPin as MapPinIcon,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  image: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  isFavorite: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: string;
  gradient: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMapMode, setIsMapMode] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchData, setSearchData] = useState({
    where: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            const location = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setSearchData(prev => ({ ...prev, where: location }));
          } catch (error) {
            // Fallback to coordinates
            setSearchData(prev => ({ ...prev, where: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
          
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          
          // Mock location for demo
          setSearchData(prev => ({ ...prev, where: 'New York, NY' }));
        }
      );
    } else {
      setIsGettingLocation(false);
      // Mock location for demo
      setSearchData(prev => ({ ...prev, where: 'New York, NY' }));
    }
  };

  const categories: Category[] = [
    { id: 'luxury', name: 'Luxury', icon: HomeIcon, count: '5', gradient: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'beach', name: 'Beach', icon: HomeIcon, count: '3', gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'mountain', name: 'Mountain', icon: HomeIcon, count: '2', gradient: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'camping', name: 'Camping', icon: HomeIcon, count: '1', gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 'rooms', name: 'Rooms', icon: HomeIcon, count: '3', gradient: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { id: 'farms', name: 'Farms', icon: HomeIcon, count: '1', gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { id: 'city', name: 'City', icon: HomeIcon, count: '4', gradient: 'bg-gradient-to-r from-gray-600 to-gray-800' },
    { id: 'trending', name: 'Trending', icon: TrendingUp, count: '1', gradient: 'bg-gradient-to-r from-orange-500 to-red-500' }
  ];

  useEffect(() => {
    // Mock data with real images from Unsplash
    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Luxury Penthouse with Ocean View',
        location: 'Miami Beach, FL',
        pricePerNight: 350,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['wifi', 'parking', 'kitchen', 'tv', 'air-conditioning'],
        isFavorite: false
      },
      {
        id: '2',
        title: 'Modern Downtown Loft',
        location: 'New York, NY',
        pricePerNight: 280,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['wifi', 'kitchen', 'tv', 'air-conditioning'],
        isFavorite: true
      },
      {
        id: '3',
        title: 'Cozy Mountain Cabin',
        location: 'Aspen, CO',
        pricePerNight: 450,
        rating: 4.95,
        image: 'https://images.unsplash.com/photo-1571003123894-1fba9c8cd528?w=800&auto=format&fit=crop',
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['wifi', 'parking', 'kitchen', 'fireplace', 'hot-tub'],
        isFavorite: false
      },
      {
        id: '4',
        title: 'Beachfront Villa Paradise',
        location: 'Malibu, CA',
        pricePerNight: 650,
        rating: 4.97,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
        guests: 10,
        bedrooms: 5,
        bathrooms: 4,
        amenities: ['wifi', 'parking', 'kitchen', 'pool', 'beach-access'],
        isFavorite: true
      },
      {
        id: '5',
        title: 'Historic European Castle',
        location: 'Edinburgh, Scotland',
        pricePerNight: 800,
        rating: 4.93,
        image: 'https://images.unsplash.com/photo-1519214935393-cbe04d1f9b5d?w=800&auto=format&fit=crop',
        guests: 12,
        bedrooms: 6,
        bathrooms: 5,
        amenities: ['wifi', 'parking', 'kitchen', 'library', 'garden'],
        isFavorite: false
      },
      {
        id: '6',
        title: 'Tropical Jungle Retreat',
        location: 'Costa Rica',
        pricePerNight: 325,
        rating: 4.85,
        image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&auto=format&fit=crop',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['wifi', 'kitchen', 'air-conditioning', 'jungle-view'],
        isFavorite: false
      }
    ];

    setListings(mockListings);
    setLoading(false);
  }, []);

  const toggleFavorite = (id: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, isFavorite: !listing.isFavorite } : listing
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'kitchen': return <Coffee className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'air-conditioning': return <Wind className="h-4 w-4" />;
      case 'gym': return <Dumbbell className="h-4 w-4" />;
      default: return <HomeIcon className="h-4 w-4" />;
    }
  };

  const filteredListings = listings.filter(listing => {
    if (selectedCategory !== 'all') {
      // Simple category filtering logic
      if (selectedCategory === 'beach' && !listing.location.toLowerCase().includes('beach') && !listing.location.toLowerCase().includes('malibu')) {
        return false;
      }
      if (selectedCategory === 'mountain' && !listing.location.toLowerCase().includes('aspen') && !listing.location.toLowerCase().includes('mountain')) {
        return false;
      }
      if (selectedCategory === 'city' && !listing.location.toLowerCase().includes('york') && !listing.location.toLowerCase().includes('miami')) {
        return false;
      }
    }
    return true;
  });

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
      {/* Hero Section with Professional Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-white rounded-full animate-float-delay-1 opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white rounded-full animate-float-delay-2 opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-white rounded-full animate-float opacity-30"></div>
          <div className="absolute bottom-1/3 right-1/2 w-4 h-4 bg-white rounded-full animate-float-delay-1 opacity-60"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 animate-fade-in-up">
              Find your perfect stay anywhere in the world
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Discover unique homes, experiences, and places around the world
            </p>
            
            {/* Big Search Bar */}
            <div className="max-w-6xl mx-auto animate-fade-in-up animation-delay-400">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-3 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                    <input
                      type="text"
                      placeholder="Where"
                      className="w-full pl-12 pr-20 py-4 text-white placeholder-white/50 bg-white/10 backdrop-blur-sm focus:outline-none focus:bg-white/20 border-r border-white/20 rounded-xl transition-all"
                      value={searchData.where}
                      onChange={(e) => setSearchData({...searchData, where: e.target.value})}
                    />
                    <button
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg disabled:opacity-50 transition-all"
                      title="Use current location"
                    >
                      {isGettingLocation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Navigation className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                    <input
                      type="date"
                      placeholder="Check-in"
                      className="w-full pl-12 pr-4 py-4 text-white placeholder-white/50 bg-white/10 backdrop-blur-sm focus:outline-none focus:bg-white/20 border-r border-white/20 rounded-xl transition-all"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                    <input
                      type="date"
                      placeholder="Check-out"
                      className="w-full pl-12 pr-4 py-4 text-white placeholder-white/50 bg-white/10 backdrop-blur-sm focus:outline-none focus:bg-white/20 border-r border-white/20 rounded-xl transition-all"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                    <select
                      className="w-full pl-12 pr-4 py-4 text-white bg-white/10 backdrop-blur-sm focus:outline-none focus:bg-white/20 border-r border-white/20 rounded-xl appearance-none transition-all"
                      value={searchData.guests}
                      onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num} className="bg-gray-800 text-white">
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white font-semibold">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="py-8 bg-gray-900 border-b sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>All</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
                <span className="text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Listings Section */}
      <div className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Listings</h2>
              <p className="text-gray-300">Handpicked properties for your perfect stay</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMapMode(!isMapMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isMapMode ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
                }`}
              >
                <MapPinIcon className="h-4 w-4" />
                <span>{isMapMode ? 'List View' : 'Map View'}</span>
              </button>
            </div>
          </div>

          {!isMapMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group rounded-2xl">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(listing.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${listing.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white font-semibold">{listing.title}</h3>
                      <p className="text-white/90 text-sm">{listing.location}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{listing.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {listing.bedrooms} beds • {listing.bathrooms} baths
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {listing.amenities.slice(0, 3).map((amenity) => (
                        <div key={amenity} className="flex items-center text-xs text-gray-600">
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${listing.pricePerNight}</span>
                        <span className="text-gray-600 text-sm"> /night</span>
                      </div>
                      <Link href={`/listings/${listing.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Map view would be displayed here</p>
                <p className="text-sm text-gray-500">In a real app, this would show an interactive map with property pins</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose StayEase</h2>
            <p className="text-xl text-gray-300">Experience the best in travel accommodation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">1000+ Stays</h3>
              <p className="text-lg text-gray-300">Properties in over 190 countries and thousands of cities</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Verified Hosts</h3>
              <p className="text-lg text-gray-300">All hosts are verified for your safety and peace of mind</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Top Rated Properties</h3>
              <p className="text-lg text-gray-300">Handpicked properties with excellent ratings and reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300">Book your perfect stay in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Search & Discover</h3>
              <p className="text-gray-300">Browse through thousands of properties and find your perfect match</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Book & Pay</h3>
              <p className="text-gray-300">Secure booking with multiple payment options and instant confirmation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Enjoy Your Stay</h3>
              <p className="text-gray-300">Check-in and enjoy your amazing accommodation experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Our Guests Say</h2>
            <p className="text-xl text-gray-300">Real reviews from real travelers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-white">Sarah Johnson</h4>
                  <div className="flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300">"Amazing experience! The property was exactly as described and the host was very helpful."</p>
            </Card>
            
            <Card className="p-6 bg-gray-800 border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-white">Mike Chen</h4>
                  <div className="flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300">"Great platform for finding unique places. The booking process was smooth and hassle-free."</p>
            </Card>
            
            <Card className="p-6 bg-gray-800 border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-white">Emily Davis</h4>
                  <div className="flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-300">"Found the perfect beach house for our family vacation. The kids loved it!"</p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have found their perfect stay with StayEase
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                Explore Properties
              </Button>
            </Link>
            <Link href="/host">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/listings" className="hover:text-gray-300">All Listings</Link></li>
                <li><Link href="/experiences" className="hover:text-gray-300">Experiences</Link></li>
                <li><Link href="/destinations" className="hover:text-gray-300">Destinations</Link></li>
                <li><Link href="/features" className="hover:text-gray-300">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Host</h3>
              <ul className="space-y-2">
                <li><Link href="/host" className="hover:text-gray-300">Become a Host</Link></li>
                <li><Link href="/host-earnings" className="hover:text-gray-300">Host Dashboard</Link></li>
                <li><Link href="/host-resources" className="hover:text-gray-300">Resources</Link></li>
                <li><Link href="/host-community" className="hover:text-gray-300">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-gray-300">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
                <li><Link href="/safety" className="hover:text-gray-300">Safety</Link></li>
                <li><Link href="/cancellation" className="hover:text-gray-300">Cancellation Options</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
                <li><Link href="/careers" className="hover:text-gray-300">Careers</Link></li>
                <li><Link href="/press" className="hover:text-gray-300">Press</Link></li>
                <li><Link href="/blog" className="hover:text-gray-300">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="flex justify-center space-x-6 mb-4">
              <Link href="/terms" className="hover:text-gray-300">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
              <Link href="/sitemap" className="hover:text-gray-300">Sitemap</Link>
            </div>
            <p className="text-gray-400">© 2024 StayEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
