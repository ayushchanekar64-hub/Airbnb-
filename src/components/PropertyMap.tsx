'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star, 
  Heart, 
  Filter,
  Layers,
  Maximize2,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isFavorite: boolean;
}

interface PropertyMapProps {
  properties: Property[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string;
}

export default function PropertyMap({ 
  properties, 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 12,
  height = '600px'
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        // Load Leaflet JS
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.onload = initializeMap;
        document.head.appendChild(leafletJS);
      } else if (window.L) {
        initializeMap();
      }
    };

    loadLeaflet();

    return () => {
      // Cleanup markers when component unmounts
      if (markers.length > 0 && map) {
        markers.forEach(marker => map.removeLayer(marker));
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    // Initialize map
    const leafletMap = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);
    
    // Add tile layer (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(leafletMap);

    setMap(leafletMap);
    setMapLoaded(true);

    // Add markers for properties
    addMarkers(leafletMap);
  };

  const addMarkers = (leafletMap: any) => {
    if (!window.L) return;

    const newMarkers = properties.map(property => {
      // Create custom icon
      const customIcon = window.L.divIcon({
        html: `
          <div class="relative">
            <div class="bg-white rounded-lg shadow-lg p-2 border-2 border-indigo-600">
              <div class="text-xs font-semibold text-gray-900">$${property.pricePerNight}</div>
              <div class="flex items-center">
                <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-xs text-gray-600 ml-1">${property.rating}</span>
              </div>
            </div>
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600"></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [80, 60],
        iconAnchor: [40, 60],
        popupAnchor: [0, -60]
      });

      // Create marker
      const marker = window.L.marker([property.coordinates.lat, property.coordinates.lng], { icon: customIcon })
        .addTo(leafletMap);

      // Create popup content
      const popupContent = `
        <div class="w-64 p-2">
          <img src="${property.image}" alt="${property.title}" class="w-full h-32 object-cover rounded-lg mb-2">
          <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
          <p class="text-xs text-gray-600 mb-2">${property.location}</p>
          <div class="flex justify-between items-center">
            <div>
              <span class="text-lg font-bold text-gray-900">$${property.pricePerNight}</span>
              <span class="text-xs text-gray-600"> /night</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-xs text-gray-600 ml-1">${property.rating}</span>
            </div>
          </div>
          <div class="mt-2">
            <a href="/listings/${property.id}" class="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
              View Details
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click event
      marker.on('click', () => {
        setSelectedProperty(property);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const toggleFavorite = (propertyId: string) => {
    // This would typically update the favorites state
    console.log('Toggle favorite for property:', propertyId);
  };

  const centerMap = () => {
    if (map && properties.length > 0) {
      const bounds = properties.map(p => [p.coordinates.lat, p.coordinates.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map) {
            map.setView([latitude, longitude], 15);
            
            // Add user location marker
            const userIcon = window.L.divIcon({
              html: `
                <div class="relative">
                  <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div class="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                </div>
              `,
              className: 'user-location-marker',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });
            
            window.L.marker([latitude, longitude], { icon: userIcon })
              .addTo(map)
              .bindPopup('Your Location');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-2">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={centerMap}
                className="w-full justify-start"
              >
                <Layers className="h-4 w-4 mr-2" />
                Fit All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={getUserLocation}
                className="w-full justify-start"
              >
                <Navigation className="h-4 w-4 mr-2" />
                My Location
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => map && map.toggleFullscreen()}
                className="w-full justify-start"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="rounded-lg overflow-hidden border"
        style={{ height }}
      >
        {!mapLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Property Sidebar */}
      {selectedProperty && (
        <Card className="absolute bottom-4 left-4 w-80 bg-white shadow-xl z-10">
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={selectedProperty.image} 
                alt={selectedProperty.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <button
                onClick={() => toggleFavorite(selectedProperty.id)}
                className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  className={`h-4 w-4 ${selectedProperty.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{selectedProperty.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{selectedProperty.location}</p>
            
            <div className="flex items-center mb-3">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{selectedProperty.rating}</span>
              <span className="text-gray-600 ml-2">(127 reviews)</span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-2xl font-bold text-gray-900">${selectedProperty.pricePerNight}</span>
                <span className="text-gray-600 text-sm"> /night</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Available
              </Badge>
            </div>

            <div className="flex space-x-2">
              <Link href={`/listings/${selectedProperty.id}`} className="flex-1">
                <Button className="w-full">View Details</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setSelectedProperty(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-3">
            <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                <span>Available Properties</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span>Your Location</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add Leaflet types to window object
declare global {
  interface Window {
    L: any;
  }
}
