'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, Sparkles, MapPin, Calendar, DollarSign, Home, Star } from 'lucide-react';

interface AIMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'recommendation' | 'price-prediction';
}

interface AIRecommendation {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  matchScore: number;
  reason: string;
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial AI greeting
    const greeting: AIMessage = {
      id: '1',
      content: 'Hello! I\'m your AI travel assistant. I can help you find the perfect property, predict prices, and plan your trip. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([greeting]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Price prediction
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('predict')) {
      return {
        content: 'Based on current market trends and historical data, I predict that prices for beachfront properties in Miami will increase by 12% next month. The best time to book for lower prices would be in the off-season (September-November).',
        type: 'price-prediction' as const
      };
    }
    
    // Recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('find')) {
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          title: 'Luxury Beach Villa',
          location: 'Miami Beach, FL',
          price: 450,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&auto=format&fit=crop',
          matchScore: 95,
          reason: 'Perfect match for your beach preferences and budget'
        },
        {
          id: '2',
          title: 'Modern Downtown Loft',
          location: 'New York, NY',
          price: 280,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&auto=format&fit=crop',
          matchScore: 88,
          reason: 'Great location with excellent amenities'
        }
      ];
      
      setRecommendations(mockRecommendations);
      return {
        content: 'Based on your preferences, I found some perfect matches for you! Here are my top recommendations:',
        type: 'recommendation' as const
      };
    }
    
    // Trip planning
    if (lowerMessage.includes('trip') || lowerMessage.includes('plan') || lowerMessage.includes('itinerary')) {
      return {
        content: 'I\'d be happy to help you plan your trip! Based on your destination, I recommend:\n\n📅 **Day 1-2**: Explore the city center and main attractions\n🏨 **Day 3-4**: Relax at your accommodation and nearby beaches\n🍽️ **Day 5**: Try local restaurants and cultural experiences\n\nWould you like me to suggest specific activities or restaurants?',
        type: 'text' as const
      };
    }
    
    // Default response
    return {
      content: 'I can help you with:\n\n🏠 **Property Recommendations** - Find perfect stays based on your preferences\n💰 **Price Predictions** - Get insights on future pricing trends\n📅 **Trip Planning** - Create personalized itineraries\n📍 **Local Insights** - Discover hidden gems and attractions\n\nWhat would you like to explore?',
      type: 'text' as const
    };
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        type: aiResponse.type
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Bot className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Please Log In</h2>
            <p className="text-white/80 mb-4">You need to be logged in to access the AI assistant.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8 h-screen flex">
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm rounded-t-lg shadow-sm p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Travel Assistant</h1>
                <p className="text-white/80 flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  Powered by advanced AI technology
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white/10 backdrop-blur-sm overflow-hidden flex flex-col border-x border-white/20">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-2xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-start gap-3 mb-2">
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`px-4 py-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/20 text-white border border-white/30'
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                        <div className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-indigo-200' : 'text-white/60'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={rec.image}
                          alt={rec.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          {rec.matchScore}% Match
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {rec.location}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm">{rec.rating}</span>
                          </div>
                          <span className="font-bold text-indigo-600">${rec.price}/night</span>
                        </div>
                        <p className="text-xs text-gray-500 italic">{rec.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white/20 px-4 py-3 rounded-lg border border-white/30">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="border-t p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage('Find me a beachfront property under $500')}
                  className="text-xs"
                >
                  🏖️ Beach Property
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage('Predict prices for next month')}
                  className="text-xs"
                >
                  📊 Price Prediction
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage('Help me plan my trip itinerary')}
                  className="text-xs"
                >
                  📅 Plan Trip
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage('What are the best local attractions?')}
                  className="text-xs"
                >
                  📍 Local Attractions
                </Button>
              </div>

              {/* Message Input */}
              <div className="flex gap-2 border-t border-white/20 p-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your travel plans..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-white/60"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
