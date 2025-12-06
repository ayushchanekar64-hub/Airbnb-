'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Globe,
  Award,
  Heart,
  Target,
  Lightbulb,
  Shield,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';

export default function CompanyPage() {
  const stats = [
    { number: '10M+', label: 'Happy Travelers' },
    { number: '2M+', label: 'Properties Worldwide' },
    { number: '150+', label: 'Countries' },
    { number: '4.8', label: 'Average Rating' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize the needs and safety of our community above all else.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly innovate to improve the travel experience for everyone.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'We build trust through transparency, security, and reliable service.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'We connect people across cultures and foster meaningful connections.'
    }
  ];

  const team = [
    {
      name: 'madhavan panchbhave ',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      bio: 'Former tech executive with 15+ years in travel industry.'
    },
    {
      name: 'krunal kaware',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop',
      bio: 'Engineering leader from top tech companies, passionate about scalable solutions.'
    },
    {
      name: 'ayush chanekar',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
      bio: 'Operations expert with experience managing global teams and logistics.'
    },
    {
      name: 'ayush chanekar',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
      bio: 'Marketing strategist who built brands for Fortune 500 companies.'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '123 Market St, San Francisco, CA 94105',
      employees: '500+'
    },
    {
      city: 'New York',
      country: 'United States',
      address: '456 Broadway, New York, NY 10013',
      employees: '300+'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '789 Oxford St, London W1C 1DX',
      employees: '200+'
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      address: '321 Shibuya, Tokyo 150-0002',
      employees: '150+'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About StayEase</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to create a world where anyone can belong anywhere, 
            providing unique travel experiences and connecting people across cultures.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Join Our Team
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-6 w-6 mr-2 text-indigo-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To make travel accessible, safe, and enjoyable for everyone by connecting 
                travelers with unique accommodations and experiences around the world.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To become the world's most trusted travel platform, where every journey 
                creates lasting memories and meaningful connections.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge className="bg-indigo-100 text-indigo-800 mb-3">{member.role}</Badge>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Offices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="font-semibold">{office.city}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{office.country}</p>
                  <p className="text-gray-600 text-sm mb-3">{office.address}</p>
                  <Badge className="bg-green-100 text-green-800">
                    {office.employees} employees
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">contact@stayease.com</p>
                <Button variant="outline" className="mt-3">Send Email</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">1-800-STAYEASE</p>
                <Button variant="outline" className="mt-3">Call Us</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600">San Francisco, CA</p>
                <Button variant="outline" className="mt-3">Get Directions</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
