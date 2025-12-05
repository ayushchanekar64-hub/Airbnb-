'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tag, 
  Percent, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Plus,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minBookingAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  description: string;
}

export default function CouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minBookingAmount: 0,
    maxDiscount: 0,
    usageLimit: 100,
    validUntil: '',
    description: ''
  });
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    if (!user) return;

    // Mock coupons data
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        code: 'SUMMER25',
        type: 'percentage',
        value: 25,
        minBookingAmount: 500,
        maxDiscount: 200,
        usageLimit: 100,
        usedCount: 45,
        validFrom: new Date('2024-06-01'),
        validUntil: new Date('2024-08-31'),
        isActive: true,
        description: 'Get 25% off on summer bookings'
      },
      {
        id: '2',
        code: 'FIRST10',
        type: 'percentage',
        value: 10,
        usageLimit: 1000,
        usedCount: 234,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        description: 'First time booking discount'
      },
      {
        id: '3',
        code: 'WELCOME50',
        type: 'fixed',
        value: 50,
        minBookingAmount: 300,
        usageLimit: 500,
        usedCount: 189,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-06-30'),
        isActive: false,
        description: '$50 off on bookings above $300'
      },
      {
        id: '4',
        code: 'FLASH20',
        type: 'percentage',
        value: 20,
        usageLimit: 50,
        usedCount: 50,
        validFrom: new Date('2024-02-01'),
        validUntil: new Date('2024-02-29'),
        isActive: false,
        description: 'Flash sale - 20% off'
      }
    ];

    setCoupons(mockCoupons);
  }, [user]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const createCoupon = () => {
    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: newCoupon.value,
      minBookingAmount: newCoupon.minBookingAmount || undefined,
      maxDiscount: newCoupon.maxDiscount || undefined,
      usageLimit: newCoupon.usageLimit,
      usedCount: 0,
      validFrom: new Date(),
      validUntil: new Date(newCoupon.validUntil),
      isActive: true,
      description: newCoupon.description
    };

    setCoupons([coupon, ...coupons]);
    setShowCreateForm(false);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 0,
      minBookingAmount: 0,
      maxDiscount: 0,
      usageLimit: 100,
      validUntil: '',
      description: ''
    });
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const isExpired = (validUntil: Date) => {
    return new Date() > validUntil;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view coupons.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupons & Promo Codes</h1>
            <p className="text-gray-600">Manage discount codes and special offers</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon
          </Button>
        </div>

        {/* Create Coupon Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter coupon code"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <select
                    id="type"
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="value">Discount Value</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder={newCoupon.type === 'percentage' ? '25' : '50'}
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({...newCoupon, value: Number(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="minBooking">Minimum Booking Amount</Label>
                  <Input
                    id="minBooking"
                    type="number"
                    placeholder="0"
                    value={newCoupon.minBookingAmount}
                    onChange={(e) => setNewCoupon({...newCoupon, minBookingAmount: Number(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="100"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({...newCoupon, usageLimit: Number(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Describe your coupon offer"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={createCoupon}>Create Coupon</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Coupons</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {coupons.filter(c => c.isActive && !isExpired(c.validUntil)).length}
                  </p>
                </div>
                <Tag className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Discount</p>
                  <p className="text-2xl font-bold text-gray-900">18%</p>
                </div>
                <Percent className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Savings</p>
                  <p className="text-2xl font-bold text-gray-900">$12.5k</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <div className="space-y-4">
          {coupons.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons yet</h3>
                <p className="text-gray-600 mb-4">Create your first coupon to start offering discounts.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </CardContent>
            </Card>
          ) : (
            coupons.map((coupon) => (
              <Card key={coupon.id} className={`transition-all hover:shadow-md ${
                !coupon.isActive || isExpired(coupon.validUntil) ? 'opacity-60' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{coupon.code}</h3>
                        <Badge className={
                          coupon.isActive && !isExpired(coupon.validUntil) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }>
                          {coupon.isActive && !isExpired(coupon.validUntil) ? 'Active' : 'Inactive'}
                        </Badge>
                        {isExpired(coupon.validUntil) && (
                          <Badge className="bg-red-100 text-red-800">Expired</Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{coupon.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Discount</p>
                          <p className="font-semibold">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                          </p>
                        </div>
                        {coupon.minBookingAmount && (
                          <div>
                            <p className="text-sm text-gray-500">Min Booking</p>
                            <p className="font-semibold">${coupon.minBookingAmount || 0}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Usage</p>
                          <p className="font-semibold">{coupon.usedCount}/{coupon.usageLimit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Valid Until</p>
                          <p className="font-semibold">{formatDate(coupon.validUntil)}</p>
                        </div>
                      </div>

                      {/* Usage Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Usage Progress</span>
                          <span>{getUsagePercentage(coupon.usedCount || 0, coupon.usageLimit || 0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${getUsagePercentage(coupon.usedCount || 0, coupon.usageLimit || 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(coupon.code)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className={coupon.isActive ? 'text-red-600' : 'text-green-600'}
                      >
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
