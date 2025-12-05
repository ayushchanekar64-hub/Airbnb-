'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Home, 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Eye, 
  Check, 
  X, 
  Trash2,
  MessageSquare,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'admin';
  joinDate: Date;
  status: 'active' | 'suspended';
}

interface Listing {
  id: string;
  title: string;
  hostName: string;
  location: string;
  price: number;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  image: string;
}

interface Booking {
  id: string;
  listingTitle: string;
  guestName: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

interface Analytics {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyGrowth: number;
  averageRating: number;
  pendingApprovals: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'bookings' | 'analytics'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      return;
    }

    // Mock data
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', joinDate: new Date('2024-01-15'), status: 'active' },
      { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'host', joinDate: new Date('2024-01-20'), status: 'active' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', joinDate: new Date('2024-02-01'), status: 'suspended' },
    ];

    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Luxury Beach Villa',
        hostName: 'Sarah Smith',
        location: 'Miami Beach, FL',
        price: 450,
        rating: 4.8,
        status: 'pending',
        createdAt: new Date('2024-02-10'),
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&auto=format&fit=crop'
      },
      {
        id: '2',
        title: 'Modern Downtown Loft',
        hostName: 'John Doe',
        location: 'New York, NY',
        price: 280,
        rating: 4.9,
        status: 'approved',
        createdAt: new Date('2024-01-25'),
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&auto=format&fit=crop'
      },
    ];

    const mockBookings: Booking[] = [
      { id: '1', listingTitle: 'Luxury Beach Villa', guestName: 'Mike Johnson', totalPrice: 1350, status: 'confirmed', createdAt: new Date('2024-02-15') },
      { id: '2', listingTitle: 'Modern Downtown Loft', guestName: 'Emily Davis', totalPrice: 560, status: 'pending', createdAt: new Date('2024-02-18') },
    ];

    const mockAnalytics: Analytics = {
      totalUsers: 1250,
      totalListings: 450,
      totalBookings: 890,
      totalRevenue: 125000,
      monthlyGrowth: 15.3,
      averageRating: 4.7,
      pendingApprovals: 12
    };

    setUsers(mockUsers);
    setListings(mockListings);
    setBookings(mockBookings);
    setAnalytics(mockAnalytics);
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleListingApproval = (listingId: string, approved: boolean) => {
    setListings(prev => prev.map(listing => 
      listing.id === listingId 
        ? { ...listing, status: approved ? 'approved' : 'rejected' }
        : listing
    ));
  };

  const handleUserSuspension = (userId: string, suspended: boolean) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: suspended ? 'suspended' : 'active' }
        : user
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalListings}</p>
              </div>
              <Home className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analytics?.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {analytics?.pendingApprovals && analytics.pendingApprovals > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Pending Approvals ({analytics.pendingApprovals})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">There are {analytics.pendingApprovals} listings waiting for your approval.</p>
            <Button 
              onClick={() => setActiveTab('listings')}
              className="mt-4"
            >
              Review Listings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.listingTitle}</p>
                    <p className="text-sm text-gray-600">{booking.guestName}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {booking.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">${booking.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Growth</span>
                <span className="flex items-center text-green-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {analytics?.monthlyGrowth}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="flex items-center font-medium">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  {analytics?.averageRating}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analytics?.monthlyGrowth || 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add User</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'host' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUserSuspension(user.id, user.status === 'active')}
                          className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Listings Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <Badge className={`absolute top-2 right-2 ${
                listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {listing.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
              <p className="text-sm text-gray-600 mb-2">Host: {listing.hostName}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-indigo-600">${listing.price}/night</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm">{listing.rating}</span>
                </div>
              </div>
              
              {listing.status === 'pending' && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleListingApproval(listing.id, true)}
                    className="flex-1"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleListingApproval(listing.id, false)}
                    className="flex-1"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.listingTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.guestName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Revenue</span>
                <span className="text-2xl font-bold text-green-600">${analytics?.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-600">75% of annual target achieved</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Users</span>
                <span className="text-2xl font-bold text-blue-600">{analytics?.totalUsers}</span>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{analytics?.monthlyGrowth}% growth this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="text-2xl font-bold text-purple-600">{analytics?.totalBookings}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-green-600 font-bold">450</div>
                  <div className="text-xs text-gray-600">Confirmed</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="text-yellow-600 font-bold">120</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-red-600 font-bold">30</div>
                  <div className="text-xs text-gray-600">Cancelled</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-bold">{analytics?.averageRating}</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Listings</span>
                <span className="font-bold">{analytics?.totalListings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Approvals</span>
                <span className="font-bold text-orange-600">{analytics?.pendingApprovals}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your StayEase platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex space-x-1 p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'listings', label: 'Listings', icon: Home },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'listings' && renderListings()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
}
