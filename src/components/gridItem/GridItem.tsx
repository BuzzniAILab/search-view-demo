import { DataType } from '@/pages/search';
import { str } from '@/utils';
import Image from 'next/image';
import React from 'react';
import { FaStar } from 'react-icons/fa6';
import Favorite from '../favorite/Favorite';

type Props = {
  item: DataType;
};

const calculateDiscount = (price: number, discountPrice: number) => {
  return 100 - Math.floor((discountPrice / price) * 100);
};

export default function GridItem({ item }: Props) {
  return (
    <div key={item.pid}>
      <div className="relative min-w-40 min-h-40 rounded-full">
        <Image
          src={item.img}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="160px, 160px"
          priority
        />
      </div>
      <span className="line-clamp-2 break-words text-base mt-3">
        {item.name}
      </span>
      <div>
        <span className="font-bold text-lg">
          {str.currency(item.sale_price)}원
        </span>
        {item.price !== item.sale_price && (
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold text-md">
              {calculateDiscount(item.price, item.sale_price)}%
            </span>
            <span className="text-sm text-gray-400 line-through">
              {str.currency(item.price || 0)}원
            </span>
          </div>
        )}
        <div className="flex items-end relative">
          {item.review_count && item.review_score && (
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <FaStar className="text-yellow-500" />
              <span className="font-bold text-gray-700 mx-1">
                {item.review_score.toFixed(1)}
              </span>
              <span>({item.review_count})</span>
            </div>
          )}
          <Favorite className="absolute bottom-0 right-0 " />
        </div>
      </div>
    </div>
  );
}
