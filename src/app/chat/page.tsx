'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isOwn: boolean;
}

interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isTyping: boolean;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock chat data
    const mockChats: Chat[] = [
      {
        id: '1',
        participantId: 'host1',
        participantName: 'John Smith (Host)',
        participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
        lastMessage: 'The property is available for your dates!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 2,
        isTyping: false
      },
      {
        id: '2',
        participantId: 'host2',
        participantName: 'Sarah Johnson (Host)',
        participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop',
        lastMessage: 'Check-in is at 3 PM',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
        unreadCount: 0,
        isTyping: true
      },
      {
        id: '3',
        participantId: 'guest1',
        participantName: 'Mike Chen (Guest)',
        participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
        lastMessage: 'Is early check-in possible?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 1,
        isTyping: false
      }
    ];

    setChats(mockChats);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Mock messages for selected chat
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: selectedChat.participantId,
          senderName: selectedChat.participantName,
          content: 'Hi! I\'m interested in booking your property.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          isRead: true,
          isOwn: false
        },
        {
          id: '2',
          senderId: user?.id || '',
          senderName: user?.name || 'You',
          content: 'Hello! The property is available for your requested dates.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
          isRead: true,
          isOwn: true
        },
        {
          id: '3',
          senderId: selectedChat.participantId,
          senderName: selectedChat.participantName,
          content: 'Great! What are the check-in and check-out times?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true,
          isOwn: false
        },
        {
          id: '4',
          senderId: user?.id || '',
          senderName: user?.name || 'You',
          content: 'Check-in is at 3 PM and check-out is at 11 AM.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isRead: true,
          isOwn: true
        },
        {
          id: '5',
          senderId: selectedChat.participantId,
          senderName: selectedChat.participantName,
          content: selectedChat.lastMessage,
          timestamp: selectedChat.lastMessageTime,
          isRead: false,
          isOwn: false
        }
      ];

      setMessages(mockMessages);
    }
  }, [selectedChat, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      senderName: user?.name || 'You',
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate typing indicator and response
    setSelectedChat(prev => prev ? { ...prev, isTyping: true } : null);
    
    setTimeout(() => {
      setSelectedChat(prev => prev ? { ...prev, isTyping: false } : null);
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChat.participantId,
        senderName: selectedChat.participantName,
        content: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date(),
        isRead: false,
        isOwn: false
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access messages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 h-screen flex">
        <div className="w-full max-w-6xl mx-auto flex gap-6 h-full">
          {/* Chat List */}
          <div className="w-1/3 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={chat.participantAvatar}
                      alt={chat.participantName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.participantName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(chat.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.isTyping ? (
                            <span className="text-indigo-600 italic">typing...</span>
                          ) : (
                            chat.lastMessage
                          )}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-indigo-600 text-white text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedChat.participantAvatar}
                      alt={selectedChat.participantName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedChat.participantName}
                      </h3>
                      {selectedChat.isTyping ? (
                        <p className="text-sm text-indigo-600 italic">typing...</p>
                      ) : (
                        <p className="text-sm text-green-600">Active now</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-end mt-1 text-xs ${
                          message.isOwn ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.isOwn && (
                            <span className="ml-1">
                              {message.isRead ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a chat from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
