'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  Calendar,
  Eye,
  Star,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    averageRating: number;
    occupancyRate: number;
    monthlyGrowth: number;
  };
  revenueChart: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  topProperties: Array<{
    id: string;
    title: string;
    revenue: number;
    bookings: number;
    rating: number;
  }>;
  guestDemographics: {
    newGuests: number;
    returningGuests: number;
    averageStay: number;
  };
}

export default function HostAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');

  useEffect(() => {
    if (!user || user.role !== 'host') return;

    // Mock analytics data - in real app, fetch from API
    const mockAnalytics: AnalyticsData = {
      overview: {
        totalRevenue: 45680,
        totalBookings: 127,
        averageRating: 4.8,
        occupancyRate: 78,
        monthlyGrowth: 12.5
      },
      revenueChart: [
        { month: 'Jan', revenue: 3200, bookings: 8 },
        { month: 'Feb', revenue: 4100, bookings: 11 },
        { month: 'Mar', revenue: 3800, bookings: 9 },
        { month: 'Apr', revenue: 5200, bookings: 14 },
        { month: 'May', revenue: 6100, bookings: 16 },
        { month: 'Jun', revenue: 7800, bookings: 21 },
      ],
      topProperties: [
        {
          id: '1',
          title: 'Modern Loft in Downtown',
          revenue: 15600,
          bookings: 45,
          rating: 4.92
        },
        {
          id: '2',
          title: 'Beachfront Villa with Pool',
          revenue: 12400,
          bookings: 32,
          rating: 4.85
        },
        {
          id: '3',
          title: 'Mountain View Cabin',
          revenue: 8900,
          bookings: 28,
          rating: 4.78
        }
      ],
      guestDemographics: {
        newGuests: 89,
        returningGuests: 38,
        averageStay: 3.2
      }
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [user, timeRange]);

  if (!user || user.role !== 'host') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need host privileges to view analytics.</p>
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

  if (!analytics) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend = 'up' 
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    trend?: 'up' | 'down';
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {change}% from last period
              </div>
            )}
          </div>
          <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your property performance and earnings</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '30d' | '90d' | '1y')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analytics.overview.totalRevenue)}
            change={analytics.overview.monthlyGrowth}
            icon={DollarSign}
            trend="up"
          />
          <MetricCard
            title="Total Bookings"
            value={analytics.overview.totalBookings}
            change={8.3}
            icon={Calendar}
            trend="up"
          />
          <MetricCard
            title="Average Rating"
            value={analytics.overview.averageRating.toFixed(1)}
            icon={Star}
          />
          <MetricCard
            title="Occupancy Rate"
            value={`${analytics.overview.occupancyRate}%`}
            change={5.2}
            icon={Home}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Revenue & Bookings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenueChart.map((item, index) => (
                    <div key={item.month} className="flex items-center">
                      <div className="w-12 text-sm text-gray-600">{item.month}</div>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                            <div
                              className="bg-indigo-600 h-6 rounded-full flex items-center justify-end pr-2"
                              style={{ width: `${(item.revenue / 8000) * 100}%` }}
                            >
                              <span className="text-xs text-white font-medium">
                                ${item.revenue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {item.bookings} bookings
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guest Demographics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Guest Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">New vs Returning</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>New Guests</span>
                      <span>{analytics.guestDemographics.newGuests}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(analytics.guestDemographics.newGuests / (analytics.guestDemographics.newGuests + analytics.guestDemographics.returningGuests)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Returning Guests</span>
                      <span>{analytics.guestDemographics.returningGuests}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(analytics.guestDemographics.returningGuests / (analytics.guestDemographics.newGuests + analytics.guestDemographics.returningGuests)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Average Stay Length</span>
                  <span className="font-medium">{analytics.guestDemographics.averageStay} nights</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(analytics.guestDemographics.averageStay / 7) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{property.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          {property.rating}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {property.bookings} bookings
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatCurrency(property.revenue)}</p>
                    <p className="text-sm text-gray-600">Total revenue</p>
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
