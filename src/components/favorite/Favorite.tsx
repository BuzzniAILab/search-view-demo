import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';

type Props = {
  [key: string]: any;
};
export default function Favorite({ ...args }: Props) {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div onClick={() => setActive(!active)} {...args}>
      {active ? (
        <FaHeart className=" text-red-500" />
      ) : (
        <FaRegHeart className=" text-gray-400" />
      )}
    </div>
  );
}
