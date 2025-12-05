'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star,
  Filter,
  Search,
  Calendar,
  MapPin,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  propertyLocation: string;
  reviewer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  date: Date;
  title: string;
  content: string;
  helpful: number;
  response?: {
    content: string;
    date: Date;
    hostName: string;
  };
  categories: {
    cleanliness: number;
    accuracy: number;
    checkIn: number;
    communication: number;
    location: number;
    value: number;
  };
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    // Mock reviews data
    const mockReviews: Review[] = [
      {
        id: '1',
        propertyId: '1',
        propertyName: 'Luxury Penthouse with Ocean View',
        propertyImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
        propertyLocation: 'Miami Beach, FL',
        reviewer: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop',
          verified: true
        },
        rating: 5,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        title: 'Absolutely stunning property!',
        content: 'This penthouse exceeded all our expectations. The view was breathtaking, the amenities were top-notch, and the host was incredibly responsive. Would definitely book again!',
        helpful: 23,
        response: {
          content: 'Thank you so much for your wonderful review, Sarah! We\'re thrilled you enjoyed your stay. Hope to welcome you back soon!',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24),
          hostName: 'Michael Chen'
        },
        categories: {
          cleanliness: 5,
          accuracy: 5,
          checkIn: 5,
          communication: 5,
          location: 5,
          value: 4
        }
      },
      {
        id: '2',
        propertyId: '2',
        propertyName: 'Modern Downtown Loft',
        propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
        propertyLocation: 'New York, NY',
        reviewer: {
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
          verified: true
        },
        rating: 4,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        title: 'Great location, minor issues',
        content: 'The loft is in an amazing location and very stylish. The only issue was the WiFi was a bit spotty. Otherwise, everything was perfect.',
        helpful: 15,
        categories: {
          cleanliness: 4,
          accuracy: 4,
          checkIn: 5,
          communication: 4,
          location: 5,
          value: 4
        }
      },
      {
        id: '3',
        propertyId: '3',
        propertyName: 'Cozy Mountain Cabin',
        propertyImage: 'https://images.unsplash.com/photo-1571003123894-1fba9c8cd528?w=800&auto=format&fit=crop',
        propertyLocation: 'Aspen, CO',
        reviewer: {
          name: 'Emily Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
          verified: true
        },
        rating: 5,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        title: 'Perfect mountain getaway',
        content: 'This cabin is exactly what we needed for our weekend retreat. Cozy, well-equipped, and surrounded by beautiful nature. The fireplace was a huge plus!',
        helpful: 31,
        response: {
          content: 'So glad you enjoyed your stay, Emily! The fireplace is definitely a guest favorite. Come back anytime!',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
          hostName: 'David Wilson'
        },
        categories: {
          cleanliness: 5,
          accuracy: 5,
          checkIn: 5,
          communication: 5,
          location: 5,
          value: 5
        }
      }
    ];

    setReviews(mockReviews);
    setLoading(false);
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = selectedRating === 'all' || review.rating === parseInt(selectedRating);
    
    return matchesSearch && matchesRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.date.getTime() - a.date.getTime();
      case 'oldest':
        return a.date.getTime() - b.date.getTime();
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const markHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}.0</span>
      </div>
    );
  };

  const renderCategoryBars = (categories: Review['categories']) => {
    return (
      <div className="space-y-2">
        {Object.entries(categories).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="capitalize text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${(value / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-white font-medium w-8">{value}.0</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      {/* Professional Background Header */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 pro-bg-gradient"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Guest Reviews
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Read authentic reviews from our community of travelers
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10 bg-gray-900 min-h-screen">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Reviews</p>
                  <p className="text-2xl font-bold text-white">{reviews.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Average Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-white">
                    {reviews.filter(r => r.rating === 5).length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Verified Reviews</p>
                  <p className="text-2xl font-bold text-white">
                    {reviews.filter(r => r.reviewer.verified).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Property Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={review.propertyImage} 
                      alt={review.propertyName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link href={`/listings/${review.propertyId}`}>
                          <h3 className="font-semibold text-lg hover:text-indigo-400 cursor-pointer text-white">
                            {review.propertyName}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-sm flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {review.propertyLocation}
                        </p>
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-sm text-gray-400 mt-1">{formatDate(review.date)}</p>
                      </div>
                    </div>

                    {/* Reviewer Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                        <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{review.reviewer.name}</span>
                        {review.reviewer.verified && (
                          <Badge className="bg-green-900 text-green-300 text-xs border-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Review Title and Content */}
                    <h4 className="font-semibold text-lg mb-2 text-white">{review.title}</h4>
                    <p className="text-gray-300 mb-4">{review.content}</p>

                    {/* Category Ratings */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-sm text-white mb-3">Detailed Ratings</h5>
                      {renderCategoryBars(review.categories)}
                    </div>

                    {/* Host Response */}
                    {review.response && (
                      <div className="bg-gray-700 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-indigo-300">Response from {review.response.hostName}</h5>
                          <span className="text-xs text-indigo-400">{formatDate(review.response.date)}</span>
                        </div>
                        <p className="text-indigo-200 text-sm">{review.response.content}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => markHelpful(review.id)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">Reply</span>
                        </button>
                      </div>
                      <Link href={`/listings/${review.propertyId}`}>
                        <Button variant="outline" size="sm">View Property</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No reviews found</h3>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
