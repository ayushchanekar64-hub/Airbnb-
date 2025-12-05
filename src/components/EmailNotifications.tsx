'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Calendar, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

interface EmailNotification {
  id: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'new_booking' | 'review_received';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export default function EmailNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Mock email notifications
    const mockNotifications: EmailNotification[] = [
      {
        id: '1',
        type: 'booking_confirmed',
        title: 'Booking Confirmed!',
        message: 'Your booking for "Luxury Penthouse with Ocean View" has been confirmed. Check-in details have been sent to your email.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false,
        actionUrl: '/bookings/1'
      },
      {
        id: '2',
        type: 'payment_received',
        title: 'Payment Received',
        message: 'Payment of $1,350 has been successfully processed for your booking at Miami Beach.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: false,
        actionUrl: '/bookings/1'
      },
      {
        id: '3',
        type: 'new_booking',
        title: 'New Booking Request',
        message: 'You have a new booking request from Emily Davis for your property in New York.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        isRead: true,
        actionUrl: '/bookings'
      },
      {
        id: '4',
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: 'A booking for "Modern Downtown Loft" has been cancelled. Refund processing has been initiated.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: true,
        actionUrl: '/bookings'
      },
      {
        id: '5',
        type: 'review_received',
        title: 'New Review Received',
        message: 'Sarah Johnson left a 5-star review for your property. "Amazing place, highly recommended!"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        isRead: true,
        actionUrl: '/listings/1/reviews'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'booking_cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'payment_received':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'new_booking':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'review_received':
        return <Mail className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return 'border-green-200 bg-green-50';
      case 'booking_cancelled':
        return 'border-red-200 bg-red-50';
      case 'payment_received':
        return 'border-blue-200 bg-blue-50';
      case 'new_booking':
        return 'border-purple-200 bg-purple-50';
      case 'review_received':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view notifications.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Notifications</h1>
              <p className="text-gray-600">Stay updated with your booking and account activities</p>
            </div>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <Badge className="bg-indigo-600 text-white">
                  {unreadCount} unread
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
          </div>

          {/* Notification Settings */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Booking confirmations', enabled: true },
                  { label: 'Booking cancellations', enabled: true },
                  { label: 'Payment receipts', enabled: true },
                  { label: 'New booking requests', enabled: true },
                  { label: 'Review notifications', enabled: true },
                  { label: 'Promotional offers', enabled: false }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">{setting.label}</span>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        setting.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">You're all caught up! No new notifications to show.</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${
                    !notification.isRead ? 'border-l-4' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className={`font-semibold text-gray-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Badge className="bg-indigo-100 text-indigo-800 text-xs">
                                New
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{notification.message}</p>
                        <div className="flex items-center gap-3">
                          {notification.actionUrl && (
                            <Button size="sm" onClick={() => markAsRead(notification.id)}>
                              View Details
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
