'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Eye,
  Calendar,
  Users,
  Bed,
  Bath
} from 'lucide-react';
import Link from 'next/link';

interface RecentlyViewed {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  image: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  viewedAt: Date;
  isFavorite: boolean;
}

export default function RecentlyViewedPage() {
  const { user } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Mock recently viewed data
    const mockRecentlyViewed: RecentlyViewed[] = [
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
        viewedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isFavorite: true
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
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isFavorite: false
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
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        isFavorite: true
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
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isFavorite: false
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
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        isFavorite: false
      }
    ];

    setRecentlyViewed(mockRecentlyViewed);
    setLoading(false);
  }, [user]);

  const toggleFavorite = (id: string) => {
    setRecentlyViewed(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const clearHistory = () => {
    setRecentlyViewed([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view your recently viewed properties.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recently Viewed</h1>
            <p className="text-gray-600">Properties you've recently explored</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-indigo-600 text-white">
              {recentlyViewed.length} properties
            </Badge>
            {recentlyViewed.length > 0 && (
              <Button variant="outline" onClick={clearHistory}>
                Clear History
              </Button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        {recentlyViewed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{recentlyViewed.length}</p>
                  </div>
                  <Eye className="h-8 w-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${Math.round(recentlyViewed.reduce((sum, item) => sum + item.pricePerNight, 0) / recentlyViewed.length)}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">$</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(recentlyViewed.reduce((sum, item) => sum + item.rating, 0) / recentlyViewed.length).toFixed(1)}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentlyViewed.filter(item => item.isFavorite).length}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recently Viewed List */}
        {recentlyViewed.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recently viewed properties</h3>
              <p className="text-gray-600 mb-4">Start exploring properties to see them here!</p>
              <Link href="/listings">
                <Button>Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map((property) => (
              <Card key={property.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group rounded-2xl">
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <Heart 
                      className={`h-4 w-4 ${property.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/70 text-white text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(property.viewedAt)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {property.location}
                  </p>
                  
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{property.rating}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} beds</span>
                    <span className="mx-2">•</span>
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} baths</span>
                    <span className="mx-2">•</span>
                    <Users className="h-4 w-4 mr-1" />
                    <span>{property.guests} guests</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${property.pricePerNight}</span>
                      <span className="text-gray-600 text-sm"> /night</span>
                    </div>
                    <Link href={`/listings/${property.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
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
