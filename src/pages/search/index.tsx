import { IoIosArrowBack } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { IoGrid } from 'react-icons/io5';
import { FaAngleDown } from 'react-icons/fa6';
import Image from 'next/image';
import { str } from '@/utils';
import { useRouter } from 'next/router';

type DataType = {
  pid: string;
  name: string;
  price: number;
  brand: string;
  url: string;
  img: string;
  sale_price: number;
  review_count: number;
  discount_amount: number;
  is_free_shipping: boolean;
  is_tv_product: boolean;
  review_score: number;
};
export default function Index() {
  const router = useRouter();
  const params: any = router.query;
  const [keyword, setKeyword] = useState<string>('');
  const [data, setData] = useState<DataType[]>([]);
  const [total, setTotal] = useState<number>(0);

  const AUTH_KEY_DEV: string = '105578c7-00c9-47c6-b140-a0870214db0e';
  const AUTH_KEY: string = '667872bd-a2d3-4c0e-bc14-c7aad851dbc6';
  let url: string = 'https://aiaas-dev.buzzni.com/api/search';

  const init = () => {
    // handleSearch();
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setKeyword(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && keyword !== '') {
      handleRouter();
    }
  };

  const handleClearClick = () => {
    setKeyword('');
  };

  const handleSearch = async () => {
    const data: any = params.query ? params : { query: '' };
    if (data) {
      url += '?' + new URLSearchParams(data).toString();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AUTH_KEY_DEV,
        },
      });
      const result = await response.json();
      setData(result?.results);
      setTotal(result?.total);
    }
  };

  const handleRouter = () => {
    const params: any = {
      query: keyword,
      limit: 100,
    };
    router.push('?' + new URLSearchParams(params).toString());
  };

  useEffect(init, []);
  useEffect(() => {
    if (params) {
      setKeyword(params.query);
      handleSearch();
    }
  }, [params]);

  return (
    <div className="flex flex-col gap-2 h-full max-w-7xl mx-auto">
      <div className="flex p-2 gap-2 bg-white sticky top-0 z-10">
        <button>
          <IoIosArrowBack size={24} />
        </button>
        <div className="rounded-full bg-gray-200 flex w-full items-center">
          <input
            name="keyword"
            type="text"
            value={keyword}
            className="m-2 bg-transparent w-full h-7 text-sm p-2 outline-none"
            placeholder="검색어를 입력해주세요."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <IoIosCloseCircleOutline size={24} onClick={handleClearClick} />
          <CiSearch
            className="text-black mr-2"
            size={24}
            onClick={handleRouter}
          />
        </div>
      </div>
      <div className="bg-white h-full p-4 flex flex-col gap-4">
        <div>
          <button className="w-28 h-9 bg-white border-gray-300 border rounded-md text-sm">
            방송상품만
          </button>
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-xs font-semibold">
              전체 {str.currency(total)}개
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button>
              <IoGrid />
            </button>
            <span className="text-gray-200">|</span>
            <button className="flex items-center gap-1">
              <span className="text-sm">인기순</span>
              <FaAngleDown className="text-gray-400" />
            </button>
          </div>
        </div>
        <div>
          <div className={`grid md:grid-cols-6 grid-cols-2 gap-4`}>
            {data &&
              data.length > 0 &&
              data.map((item) => (
                <div key={item.pid}>
                  <div className="relative min-w-40 min-h-40 rounded-full">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="160px, 160px"
                    />
                  </div>
                  <span className="line-clamp-2 break-words text-base">
                    {item.name}
                  </span>
                  <div>
                    <span className="font-bold text-lg">
                      {str.currency(item.price)}원
                    </span>
                    <div className="flex">
                      <span>0%</span>
                      <span>{str.currency(item.sale_price || 0)}원</span>
                    </div>
                    <div className="flex gap-1 text-xs text-gray-400">
                      <span>TV쇼핑</span>
                      <span>휙백송</span>
                      <span>무료배송</span>
                    </div>
                    <div className="flex text-xs text-gray-400">
                      <span>
                        {`${item.review_score}(${item.review_count || 0})`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-4">
            <button className="border w-full h-8">
              <span>상품 더보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
