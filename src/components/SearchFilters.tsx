'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, X, MapPin, Calendar, Users, Home, Wifi, Car, Coffee } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
}

const amenityOptions = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'kitchen', label: 'Kitchen', icon: Coffee },
  { id: 'air-conditioning', label: 'Air Conditioning', icon: null },
  { id: 'heating', label: 'Heating', icon: null },
  { id: 'washer', label: 'Washer', icon: null },
  { id: 'pool', label: 'Pool', icon: null },
  { id: 'gym', label: 'Gym', icon: null },
];

const propertyTypes = [
  'apartment', 'house', 'villa', 'cabin', 'studio', 'condo', 'townhouse', 'loft'
];

export default function SearchFilters({ onFiltersChange, initialFilters = {} }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    checkIn: initialFilters.checkIn || '',
    checkOut: initialFilters.checkOut || '',
    guests: initialFilters.guests || 1,
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    propertyType: initialFilters.propertyType || 'all',
    amenities: initialFilters.amenities || [],
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = filters.amenities.includes(amenityId)
      ? filters.amenities.filter((a: string) => a !== amenityId)
      : [...filters.amenities, amenityId];
    
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      minPrice: '',
      maxPrice: '',
      propertyType: 'all',
      amenities: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = [
    filters.location,
    filters.checkIn,
    filters.checkOut,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length + filters.amenities.length + (filters.propertyType !== 'all' ? 1 : 0);

  return (
    <div className="w-full">
      {/* Main Search Bar */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Where are you going?"
                  className="pl-10"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10"
                  value={filters.checkIn}
                  onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm pl-10"
                  value={filters.guests}
                  onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 px-1.5 py-0.5 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {isOpen && (
        <Card className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Price Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice" className="text-xs text-gray-600">Min Price</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-xs text-gray-600">Max Price</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Property Type */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Property Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.propertyType === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleFilterChange('propertyType', 'all')}
                >
                  All Types
                </button>
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors capitalize ${
                      filters.propertyType === type
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleFilterChange('propertyType', type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenityOptions.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <button
                      key={amenity.id}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                        filters.amenities.includes(amenity.id)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAmenityToggle(amenity.id)}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{amenity.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {filters.location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('location', '')}
              />
            </Badge>
          )}
          {filters.minPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Min: ${filters.minPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('minPrice', '')}
              />
            </Badge>
          )}
          {filters.maxPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Max: ${filters.maxPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('maxPrice', '')}
              />
            </Badge>
          )}
          {filters.propertyType !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 capitalize">
              <Home className="h-3 w-3" />
              {filters.propertyType}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('propertyType', 'all')}
              />
            </Badge>
          )}
          {filters.amenities.map((amenityId: string) => {
            const amenity = amenityOptions.find(a => a.id === amenityId);
            return amenity ? (
              <Badge key={amenityId} variant="secondary" className="flex items-center gap-1">
                {amenity.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleAmenityToggle(amenityId)}
                />
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
