'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home as HomeIcon,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Award,
  CheckCircle,
  Star,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function HostPage() {
  const { user } = useAuth();
  const [isHost, setIsHost] = useState(false);
  const [hostData, setHostData] = useState({
    totalEarnings: 0,
    activeListings: 0,
    totalBookings: 0,
    averageRating: 0,
    responseRate: 98
  });

  useEffect(() => {
    if (user?.role === 'host') {
      setIsHost(true);
      setHostData({
        totalEarnings: 45680,
        activeListings: 3,
        totalBookings: 127,
        averageRating: 4.8,
        responseRate: 98
      });
    }
  }, [user]);

  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn Extra Income',
      description: 'Make money from your spare space or primary residence'
    },
    {
      icon: Shield,
      title: 'Host Protection',
      description: 'Get $1M property damage protection and liability coverage'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Join millions of hosts worldwide and share experiences'
    },
    {
      icon: Award,
      title: 'Superhost Program',
      description: 'Earn recognition and benefits for outstanding hosting'
    }
  ];

  const steps = [
    { number: '1', title: 'Create Listing', description: 'Add photos, details, and set your price' },
    { number: '2', title: 'Set Availability', description: 'Choose when guests can book your space' },
    { number: '3', title: 'Welcome Guests', description: 'Communicate and provide a great experience' },
    { number: '4', title: 'Get Paid', description: 'Receive payments 24 hours after check-in' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <HomeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to become a host.</p>
            <div className="mt-6 space-x-4">
              <Link href="/login">
                <Button>Log In</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Dashboard</h1>
              <p className="text-gray-600">Manage your properties and bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Host
              </Badge>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">${hostData.totalEarnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{hostData.activeListings}</p>
                  </div>
                  <HomeIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{hostData.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{hostData.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Manage Listings</h3>
                <p className="text-gray-600 mb-4">Update property details and availability</p>
                <Button variant="outline" className="w-full">View All Listings</Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">View Reservations</h3>
                <p className="text-gray-600 mb-4">Check upcoming and past bookings</p>
                <Button variant="outline" className="w-full">View Calendar</Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Earnings Report</h3>
                <p className="text-gray-600 mb-4">Track your income and expenses</p>
                <Button variant="outline" className="w-full">View Earnings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Become a Host page
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Become a Host</h1>
          <p className="text-xl text-white/90 mb-8">Share your space, earn extra income, and meet amazing people</p>
          <Link href="/host/listings/new">
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
            Get Started
          </Button>
        </Link>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Host with StayEase?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-white">{benefit.title}</h3>
                  <p className="text-white/80">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow-400 text-indigo-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Host Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg mb-2 text-white">Sarah Johnson</h3>
              <p className="text-white/80 mb-2">Miami Beach, FL</p>
              <p className="text-sm text-white/70">"Hosting changed my life. I make $3,000 extra per month!"</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg mb-2 text-white">Mike Chen</h3>
              <p className="text-white/80 mb-2">New York, NY</p>
              <p className="text-sm text-white/70">"I've hosted over 100 guests and made $45,000 last year."</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg mb-2 text-white">Emily Rodriguez</h3>
              <p className="text-white/80 mb-2">Austin, TX</p>
              <p className="text-sm text-white/70">"The platform is easy to use and the support is amazing."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
