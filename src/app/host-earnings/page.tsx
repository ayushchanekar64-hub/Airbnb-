'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Home, 
  Users, 
  Download,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface EarningsData {
  totalEarnings: number;
  currentMonth: number;
  previousMonth: number;
  monthlyGrowth: number;
  totalBookings: number;
  averageRating: number;
  occupancyRate: number;
  activeListings: number;
}

interface MonthlyEarnings {
  month: string;
  earnings: number;
  bookings: number;
}

interface RecentTransaction {
  id: string;
  listingTitle: string;
  guestName: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function HostEarningsPage() {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyEarnings[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    if (!user || user.role !== 'host') {
      return;
    }

    // Mock earnings data
    const mockEarningsData: EarningsData = {
      totalEarnings: 45680,
      currentMonth: 8750,
      previousMonth: 7200,
      monthlyGrowth: 21.5,
      totalBookings: 89,
      averageRating: 4.8,
      occupancyRate: 78,
      activeListings: 3
    };

    const mockMonthlyData: MonthlyEarnings[] = [
      { month: 'Jan', earnings: 6200, bookings: 12 },
      { month: 'Feb', earnings: 7100, bookings: 14 },
      { month: 'Mar', earnings: 8900, bookings: 18 },
      { month: 'Apr', earnings: 7200, bookings: 15 },
      { month: 'May', earnings: 8750, bookings: 17 },
      { month: 'Jun', earnings: 9500, bookings: 20 }
    ];

    const mockTransactions: RecentTransaction[] = [
      {
        id: '1',
        listingTitle: 'Luxury Penthouse with Ocean View',
        guestName: 'Emily Davis',
        amount: 1350,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'completed'
      },
      {
        id: '2',
        listingTitle: 'Modern Downtown Loft',
        guestName: 'Michael Chen',
        amount: 840,
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: 'completed'
      },
      {
        id: '3',
        listingTitle: 'Cozy Mountain Cabin',
        guestName: 'Sarah Johnson',
        amount: 2250,
        date: new Date(Date.now() - 1000 * 60 * 60 * 72),
        status: 'pending'
      },
      {
        id: '4',
        listingTitle: 'Beachfront Villa Paradise',
        guestName: 'David Wilson',
        amount: 3250,
        date: new Date(Date.now() - 1000 * 60 * 60 * 96),
        status: 'cancelled'
      }
    ];

    setEarningsData(mockEarningsData);
    setMonthlyData(mockMonthlyData);
    setRecentTransactions(mockTransactions);
  }, [user]);

  if (!user || user.role !== 'host') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Host Access Required</h2>
            <p className="text-gray-600">You need a host account to view earnings dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    // Mock export functionality
    alert('Earnings data exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Earnings Dashboard</h1>
            <p className="text-gray-600">Track your rental income and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(earningsData?.totalEarnings || 0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(earningsData?.currentMonth || 0)}
                  </p>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {earningsData?.monthlyGrowth}%
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {earningsData?.totalBookings || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {earningsData?.occupancyRate}%
                  </p>
                </div>
                <Home className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(month.earnings / 10000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-20 text-right">
                        {formatCurrency(month.earnings)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full mx-0.5 ${
                          i < Math.floor(earningsData?.averageRating || 0)
                            ? 'bg-yellow-400'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                    <span className="ml-2 font-medium">{earningsData?.averageRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Listings</span>
                  <span className="font-medium">{earningsData?.activeListings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Response Time</span>
                  <span className="font-medium">2 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.listingTitle}</p>
                      <p className="text-sm text-gray-600">{transaction.guestName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
