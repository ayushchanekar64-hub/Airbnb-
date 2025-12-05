'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  Shield,
  CreditCard,
  Home as HomeIcon,
  Calendar,
  Users,
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    {
      id: 'booking',
      name: 'Booking & Reservations',
      icon: Calendar,
      description: 'How to book, modify, and cancel reservations',
      articles: [
        'How to make a reservation',
        'Modifying your booking',
        'Cancellation policy',
        'Payment methods',
        'Booking confirmation'
      ]
    },
    {
      id: 'account',
      name: 'Account & Profile',
      icon: Users,
      description: 'Managing your account and personal information',
      articles: [
        'Creating an account',
        'Updating profile information',
        'Password reset',
        'Account verification',
        'Privacy settings'
      ]
    },
    {
      id: 'payment',
      name: 'Payment & Pricing',
      icon: CreditCard,
      description: 'Understanding costs, fees, and payment options',
      articles: [
        'Payment methods accepted',
        'Service fees',
        'Security deposits',
        'Refund policy',
        'Currency and exchange rates'
      ]
    },
    {
      id: 'safety',
      name: 'Safety & Security',
      icon: Shield,
      description: 'Keeping you safe during your stay',
      articles: [
        'Host verification',
        'Property safety standards',
        'Emergency procedures',
        'Travel insurance',
        'Reporting issues'
      ]
    },
    {
      id: 'hosting',
      name: 'Hosting',
      icon: HomeIcon,
      description: 'Everything you need to know about hosting',
      articles: [
        'Becoming a host',
        'Setting up your listing',
        'Pricing your property',
        'House rules',
        'Managing reservations'
      ]
    },
    {
      id: 'policies',
      name: 'Policies & Guidelines',
      icon: FileText,
      description: 'Terms, conditions, and community guidelines',
      articles: [
        'Terms of Service',
        'Privacy Policy',
        'Community Guidelines',
        'Non-discrimination Policy',
        'Content Guidelines'
      ]
    }
  ];

  const popularArticles = [
    'How do I cancel a reservation?',
    'What is the cancellation policy?',
    'How do I contact my host?',
    'Payment and refund timeline',
    'How to become a host',
    'Safety guidelines for guests',
    'What fees should I expect?',
    'How to modify my booking'
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team 24/7',
      action: 'Start Chat',
      available: 'Available now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      action: 'Send Email',
      available: 'Response within 24h'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM'
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to common questions or contact our support team</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 py-4 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {popularArticles.slice(0, 8).map((article, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="text-sm text-gray-700">{article}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.articles.slice(0, 3).map((article, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 hover:text-indigo-600 cursor-pointer">
                        <ChevronRight className="h-3 w-3 mr-1" />
                        {article}
                      </div>
                    ))}
                    {category.articles.length > 3 && (
                      <div className="text-sm text-indigo-600 font-medium cursor-pointer">
                        View all {category.articles.length} articles →
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <option.icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <Badge className="bg-green-100 text-green-800 mb-4">
                    {option.available}
                  </Badge>
                  <Button className="w-full">
                    {option.action}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Emergency Support</h3>
              <p className="text-red-700">For urgent safety concerns or emergencies, please call our 24/7 hotline: 1-800-STAYEASE</p>
            </div>
          </div>
        </div>

        {/* Resource Links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Help Center
            </Button>
            <Button variant="outline" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Community Forum
            </Button>
            <Button variant="outline" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
