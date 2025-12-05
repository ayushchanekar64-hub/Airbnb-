'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  Users, 
  Star, 
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface HostStats {
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalViews: number;
  monthlyGrowth: number;
}

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  views: number;
  bookings: number;
  status: 'active' | 'inactive' | 'pending';
  image: string;
}

export default function HostDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<HostStats>({
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalViews: 0,
    monthlyGrowth: 0
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockStats: HostStats = {
      totalListings: 3,
      totalBookings: 47,
      totalRevenue: 12450,
      averageRating: 4.8,
      totalViews: 1250,
      monthlyGrowth: 12.5
    };

    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Modern Loft in Downtown',
        location: 'New York, NY',
        price: 120,
        rating: 4.92,
        views: 450,
        bookings: 23,
        status: 'active',
        image: '/images/placeholder-1.jpg'
      },
      {
        id: '2',
        title: 'Beachfront Villa with Pool',
        location: 'Miami, FL',
        price: 250,
        rating: 4.85,
        views: 380,
        bookings: 15,
        status: 'active',
        image: '/images/placeholder-2.jpg'
      },
      {
        id: '3',
        title: 'Mountain View Cabin',
        location: 'Aspen, CO',
        price: 180,
        rating: 4.78,
        views: 420,
        bookings: 9,
        status: 'pending',
        image: '/images/placeholder-3.jpg'
      }
    ];

    setStats(mockStats);
    setListings(mockListings);
    setLoading(false);
  }, []);

  if (!user || user.role !== 'host') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need host privileges to access this page.</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Host Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your listings and track your performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                  <Home className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold">{stats.totalListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Views</span>
                      <span className="text-sm font-medium">{stats.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Monthly Growth</span>
                      <span className="text-sm font-medium text-green-600">+{stats.monthlyGrowth}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.monthlyGrowth * 4}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                  <span>Your listings are performing 15% better than average</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/host/listings/new">
                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Listing
                </Button>
              </Link>
              <Link href="/host/calendar">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Calendar
                </Button>
              </Link>
              <Link href="/host/analytics">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* My Listings */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Listings</CardTitle>
              <Link href="/host/listings">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Home className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{listing.title}</h3>
                        <p className="text-gray-600 text-sm">{listing.location}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">${listing.price}/night</span>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span>{listing.rating}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{listing.views}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{listing.bookings} bookings</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        listing.status === 'active' ? 'bg-green-100 text-green-800' :
                        listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {listing.status}
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
