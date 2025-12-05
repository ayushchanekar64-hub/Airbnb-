'use client';

import { useState, useEffect } from 'react';
import { MapPin, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  isFavorite: boolean;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}

export default function ListingsPage() {
  const listings = [
    {
      id: '1',
      title: 'Luxury Penthouse with Ocean View',
      location: 'Miami Beach, FL',
      price: 350,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Modern Downtown Loft',
      location: 'New York, NY',
      price: 280,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 6,
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Cozy Mountain Cabin',
      location: 'Aspen, CO',
      price: 450,
      rating: 4.95,
      image: 'https://images.unsplash.com/photo-1571003123894-1fba9c8cd528?w=800&auto=format&fit=crop',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      isFavorite: false,
    },
    {
      id: '4',
      title: 'Beachfront Villa Paradise',
      location: 'Malibu, CA',
      price: 650,
      rating: 4.97,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      bedrooms: 5,
      bathrooms: 4,
      maxGuests: 10,
      isFavorite: false,
    },
    {
      id: '5',
      title: 'Historic European Castle',
      location: 'Edinburgh, Scotland',
      price: 800,
      rating: 4.93,
      image: 'https://images.unsplash.com/photo-1519214935393-cbe04d1f9b5d?w=800&auto=format&fit=crop',
      bedrooms: 6,
      bathrooms: 5,
      maxGuests: 12,
      isFavorite: false,
    },
    {
      id: '6',
      title: 'Tropical Jungle Retreat',
      location: 'Costa Rica',
      price: 325,
      rating: 4.85,
      image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      isFavorite: false,
    },
    {
      id: '7',
      title: 'Desert Oasis Villa',
      location: 'Phoenix, AZ',
      price: 275,
      rating: 4.82,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      isFavorite: false,
    },
    {
      id: '8',
      title: 'Arctic Glass Igloo',
      location: 'Finland',
      price: 950,
      rating: 4.98,
      image: 'https://images.unsplash.com/photo-1516396182272-dba50b2906a0?w=800&auto=format&fit=crop',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      isFavorite: false,
    },
    {
      id: '9',
      title: 'Santorini Cliff House',
      location: 'Santorini, Greece',
      price: 550,
      rating: 4.91,
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      isFavorite: false,
    },
    {
      id: '10',
      title: 'Tokyo Modern Apartment',
      location: 'Tokyo, Japan',
      price: 420,
      rating: 4.86,
      image: 'https://images.unsplash.com/photo-1515522697127-63e39e76e5d5?w=800&auto=format&fit=crop',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      isFavorite: false,
    },
    {
      id: '11',
      title: 'Swiss Alpine Chalet',
      location: 'Swiss Alps, Switzerland',
      price: 680,
      rating: 4.94,
      image: 'https://images.unsplash.com/photo-1542718615-a1c98db2d836?w=800&auto=format&fit=crop',
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      isFavorite: false,
    },
    {
      id: '12',
      title: 'Dubai Luxury Suite',
      location: 'Dubai, UAE',
      price: 750,
      rating: 4.89,
      image: 'https://images.unsplash.com/photo-1586102492144-f4ad72ab7711?w=800&auto=format&fit=crop',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      isFavorite: false,
    }
  ];

  // Calculate category counts based on actual listings
  const categoryCounts = {
    'Luxury': 5, // Luxury Penthouse, Beachfront Villa, Historic Castle, Dubai Suite, Desert Villa
    'Beach': 3, // Miami Beach, Malibu Beach, Santorini
    'Mountain': 2, // Aspen Cabin, Swiss Alps
    'Camping': 1, // Tropical Jungle Retreat
    'Rooms': 3, // Modern Loft, Tokyo Apartment, Arctic Igloo
    'Farms': 1, // Cozy Mountain Cabin
    'City': 4, // New York, Tokyo, Dubai, London (if added)
  };

  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Listing[]>(listings);

  const handleSearch = () => {
    let filtered = listings;
    
    // Filter by location
    if (searchLocation) {
      filtered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    setFilteredProperties(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchLocation]);

  return (
    <div style={{ 
      padding: '50px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          color: '#ffffff', 
          marginBottom: '15px', 
          fontWeight: '800',
          textShadow: '0 4px 6px rgba(0,0,0,0.3)',
          letterSpacing: '-1px'
        }}>Explore Properties</h1>
        <p style={{ 
          fontSize: '20px', 
          color: 'rgba(255,255,255,0.9)', 
          marginBottom: '10px',
          fontWeight: '300'
        }}>Discover amazing places to stay</p>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <p style={{ 
            fontSize: '16px', 
            color: '#ffffff', 
            margin: 0,
            fontWeight: '500'
          }}>{filteredProperties.length} properties found</p>
        </div>
      </div>
      
      {/* Categories Section */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} style={{
              textAlign: 'center',
              padding: '15px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '16px',
                color: '#ffffff',
                marginBottom: '5px',
                fontWeight: '600'
              }}>{category}</h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.8)',
                margin: 0
              }}>{count} properties</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search Section */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '40px' }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            alignItems: 'end'
          }}>
            {/* Location Search */}
            <div>
              <label style={{
                display: 'block',
                color: '#ffffff',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Location</label>
              <input
                type="text"
                placeholder="Search by location (e.g., India, Miami, New York)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              />
            </div>
            
            {/* Check-in Date */}
            <div>
              <label style={{
                display: 'block',
                color: '#ffffff',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              />
            </div>
            
            {/* Check-out Date */}
            <div>
              <label style={{
                display: 'block',
                color: '#ffffff',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              />
            </div>
            
            {/* Search Button */}
            <div>
              <button
                onClick={handleSearch}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  color: '#667eea',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
              >
                Search Properties
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px', position: 'relative', zIndex: 1 }}>
        {filteredProperties.map((listing) => (
          <div 
            key={listing.id} 
            style={{ 
              backgroundColor: 'rgba(30,30,30,0.95)', 
              borderRadius: '20px', 
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            }}
          >
            {/* Image */}
            <div style={{ height: '250px', position: 'relative', overflow: 'hidden' }}>
              <img 
                src={listing.image} 
                alt={listing.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/${listing.id}/400/300.jpg`;
                }}
              />

              {/* Price Badge */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '15px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                fontWeight: 'bold'
              }}>
                ${listing.price} / night
              </div>
            </div>
            
            {/* Content */}
            <div style={{ padding: '25px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                color: '#ffffff', 
                marginBottom: '10px', 
                fontWeight: '700',
                lineHeight: '1.3'
              }}>{listing.title}</h3>
              
              <p style={{ 
                fontSize: '15px', 
                color: '#cccccc', 
                marginBottom: '15px', 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: '500'
              }}>
                <MapPin style={{ width: '16px', height: '16px', marginRight: '8px', color: '#e74c3c' }} />
                {listing.location}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <Star style={{ width: '16px', height: '16px', color: '#f39c12', marginRight: '8px', fill: '#f39c12' }} />
                <span style={{ fontSize: '15px', color: '#ffffff', fontWeight: '600' }}>{listing.rating}</span>
                <span style={{ fontSize: '13px', color: '#cccccc', marginLeft: '8px' }}>(Excellent)</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#cccccc', 
                    margin: '0 0 5px 0',
                    fontWeight: '500'
                  }}>
                    {listing.bedrooms} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'} • {listing.bathrooms} {listing.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                  </p>
                  <p style={{ fontSize: '13px', color: '#cccccc', margin: 0, fontWeight: '500' }}>
                    Up to {listing.maxGuests} guests
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/listings/${listing.id}`}>
                    <button style={{ 
                      padding: '10px 20px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '25px', 
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}>
                      Reserve
                    </button>
                  </Link>
                  <Link href={`/listings/${listing.id}`}>
                    <button style={{ 
                      padding: '10px 20px', 
                      backgroundColor: 'transparent', 
                      color: '#667eea', 
                      border: '2px solid #667eea', 
                      borderRadius: '25px', 
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}