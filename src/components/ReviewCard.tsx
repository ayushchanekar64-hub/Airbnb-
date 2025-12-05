'use client';

import { Star, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewCardProps {
  review: {
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    date: string;
    comment: string;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center flex-shrink-0">
            {review.avatar ? (
              <img
                src={review.avatar}
                alt={review.author}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium">{review.author}</span>
                <div className="flex items-center mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(review.date).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
