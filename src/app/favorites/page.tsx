'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, MapPin, Star, Home, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface FavoriteListing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  savedAt: string;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Mock data - in real app, fetch from API
    const mockFavorites: FavoriteListing[] = [
      {
        id: '1',
        title: 'Luxury Penthouse with Ocean View',
        location: 'Miami Beach, FL',
        price: 350,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        savedAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'Beachfront Villa Paradise',
        location: 'Malibu, CA',
        price: 650,
        rating: 4.97,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        savedAt: '2024-01-10'
      },
      {
        id: '5',
        title: 'Luxury Villa in Bali',
        location: 'Bali, Indonesia',
        price: 300,
        rating: 4.95,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        savedAt: '2024-01-05'
      }
    ];

    setFavorites(mockFavorites);
    setLoading(false);
  }, [user]);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view your favorites.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="h-8 w-8 mr-3 text-red-500" />
            My Favorites
          </h1>
          <p className="text-gray-600 mt-2">Properties you've saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Start exploring and save properties you love!</p>
            <Link href="/listings">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                You have {favorites.length} {favorites.length === 1 ? 'favorite property' : 'favorite properties'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => removeFavorite(listing.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs">
                      Saved {new Date(listing.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/listings/${listing.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-indigo-600 transition-colors">
                        {listing.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> {listing.location}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      {listing.bedrooms} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'} • {listing.bathrooms} {listing.bathrooms === 1 ? 'bathroom' : 'bathrooms'} • Up to {listing.maxGuests} guests
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{listing.rating}</span>
                      </div>
                      <p className="font-semibold text-lg">
                        ${listing.price} <span className="text-gray-500 font-normal text-sm">/night</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clear All Button */}
            {favorites.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to remove all favorites?')) {
                      setFavorites([]);
                    }
                  }}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Favorites
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
