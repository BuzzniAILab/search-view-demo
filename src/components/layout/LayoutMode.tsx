import React, { useEffect, useState } from 'react';
import { FaListUl } from 'react-icons/fa';
import { IoGrid } from 'react-icons/io5';

type Props = {
  onClick: (isGrid: boolean) => void;
  [key: string]: any;
};
export default function LayoutMode({ onClick, ...args }: Props) {
  const [isGrid, setIsGrid] = useState<boolean>(true);

  const clickHandler = () => {
    setIsGrid(!isGrid);
  };

  useEffect(() => {
    onClick(isGrid);
  }, [isGrid]);

  return (
    <div {...args}>
      <button onClick={clickHandler}>
        {isGrid ? (
          <FaListUl className="text-gray-700" />
        ) : (
          <IoGrid className="text-gray-700" />
        )}
      </button>
    </div>
  );
}
