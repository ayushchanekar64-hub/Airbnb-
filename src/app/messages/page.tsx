'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Clock, 
  Star,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    role: 'guest' | 'host';
  };
  property: {
    id: string;
    title: string;
    image: string;
    location: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  bookingId?: string;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    role: 'guest' | 'host';
  };
  property: {
    id: string;
    title: string;
    image: string;
    location: string;
  };
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  bookingStatus?: 'pending' | 'confirmed' | 'completed';
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participant: {
          id: 'host1',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop',
          role: 'host'
        },
        property: {
          id: '1',
          title: 'Luxury Penthouse with Ocean View',
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
          location: 'Miami Beach, FL'
        },
        lastMessage: 'Hi! I\'d love to book your place for next weekend. Is it available?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 2,
        bookingStatus: 'pending'
      },
      {
        id: '2',
        participant: {
          id: 'guest1',
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
          role: 'guest'
        },
        property: {
          id: '2',
          title: 'Modern Downtown Loft',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
          location: 'New York, NY'
        },
        lastMessage: 'Thank you for the quick response! I\'m excited to stay at your place.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 0,
        bookingStatus: 'confirmed'
      },
      {
        id: '3',
        participant: {
          id: 'guest2',
          name: 'Emily Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
          role: 'guest'
        },
        property: {
          id: '3',
          title: 'Cozy Mountain Cabin',
          image: 'https://images.unsplash.com/photo-1571003123894-1fba9c8cd528?w=800&auto=format&fit=crop',
          location: 'Aspen, CO'
        },
        lastMessage: 'What time is check-in? Also, is there parking available?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        unreadCount: 1,
        bookingStatus: 'confirmed'
      }
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages for the selected conversation
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: {
            id: selectedConversation.participant.id,
            name: selectedConversation.participant.name,
            avatar: selectedConversation.participant.avatar,
            role: selectedConversation.participant.role
          },
          property: selectedConversation.property,
          content: 'Hi! I\'m interested in booking your property.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRead: true
        },
        {
          id: '2',
          sender: {
            id: user?.id || '',
            name: user?.name || 'You',
            avatar: user?.avatar || '',
            role: 'guest'
          },
          property: selectedConversation.property,
          content: 'Hello! Yes, the property is available. What dates are you looking for?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
          isRead: true
        },
        {
          id: '3',
          sender: {
            id: selectedConversation.participant.id,
            name: selectedConversation.participant.name,
            avatar: selectedConversation.participant.avatar,
            role: selectedConversation.participant.role
          },
          property: selectedConversation.property,
          content: selectedConversation.lastMessage,
          timestamp: selectedConversation.timestamp,
          isRead: false
        }
      ];

      setMessages(mockMessages);
    }
  }, [selectedConversation, user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || '',
        role: 'guest'
      },
      property: selectedConversation.property,
      content: newMessage,
      timestamp: new Date(),
      isRead: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMessage, timestamp: new Date(), unreadCount: 0 }
        : conv
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to access your messages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Communicate with hosts and guests</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge className="bg-indigo-600 text-white">
              {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No conversations found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                            <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-sm truncate">{conversation.participant.name}</h4>
                              <span className="text-xs text-gray-500">{formatTimeAgo(conversation.timestamp)}</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{conversation.lastMessage}</p>
                            <div className="flex items-center justify-between mt-1">
                              <Badge variant="outline" className="text-xs">
                                {conversation.participant.role}
                              </Badge>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} />
                        <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                        <p className="text-sm text-gray-600">{selectedConversation.property.title}</p>
                      </div>
                    </div>
                    {selectedConversation.bookingStatus && (
                      <Badge className={
                        selectedConversation.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedConversation.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {selectedConversation.bookingStatus}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          message.sender.id === user.id 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        } rounded-lg p-3`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender.id === user.id ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {formatTimeAgo(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
