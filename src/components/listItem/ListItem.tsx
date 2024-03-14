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

export default function ListItem({ item }: Props) {
  return (
    <div key={item.pid} className="flex gap-4 items-center w-full">
      <div className="relative relative w-20 h-20 min-h-24 min-w-24">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col w-full">
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
    </div>
  );
}
