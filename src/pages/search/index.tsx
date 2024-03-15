import { IoIosArrowBack, IoMdCloseCircleOutline } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { IoCloseCircleSharp, IoGrid } from 'react-icons/io5';
import { FaAngleDown, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa6';
import { str } from '@/utils';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';
import LayoutMode from '@/components/layout/LayoutMode';
import GirdItem from '@/components/gridItem/GridItem';
import ListItem from '@/components/listItem/ListItem';
import Head from 'next/head';
import { initKeyword } from '@/helper/function';

export type DataType = {
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
  const [assignData, setAssignData] = useState<DataType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isTv, setTv] = useState<boolean>(false);
  const [isGrid, setGrid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>('');

  const AUTH_KEY_DEV: string = '105578c7-00c9-47c6-b140-a0870214db0e';
  const AUTH_KEY: string = '667872bd-a2d3-4c0e-bc14-c7aad851dbc6';
  let url: string = 'https://aiaas-dev.buzzni.com/api/search';

  const init = () => {};

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setKeyword(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && keyword !== '') {
      handleRouter();
      e.target.blur();
    }
  };

  const handleClearClick = () => {
    setKeyword('');
  };

  const tvClickHandler = () => {
    setTv(!isTv);
  };

  const changeLayoutHandler = (isGrid: boolean) => {
    setGrid(isGrid);
  };

  const handleChangeSortType = (e: any) => {
    setSortType(e.target.value);
  };

  const handleSearch = async () => {
    if (!params.query) {
      handleRouter();
      return;
    }

    const data: any = params.query ? params : { query: '' };
    if (data) {
      url += '?' + new URLSearchParams(data).toString();
      setLoading(true);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AUTH_KEY_DEV,
        },
      });
      setLoading(false);
      const result = await response.json();

      if (result.total === 0) return;

      setData(result?.results);
      setAssignData(result?.results);
      setTotal(result?.total);
    }
  };

  const handleRouter = () => {
    const params: any = {
      query: keyword || initKeyword,
      limit: 20,
      order: sortType || 'popularity_score_desc',
    };
    router.push('?' + new URLSearchParams(params).toString());
  };

  useEffect(() => {
    setAssignData(isTv ? data.filter((item) => item.is_tv_product) : data);
  }, [isTv]);

  useEffect(() => {
    if (router.query) {
      setKeyword(params.query);
      handleSearch();
    }
  }, [router]);

  useEffect(() => {
    if (sortType !== '') {
      handleRouter();
    }
  }, [sortType]);

  useEffect(init, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      {loading && (
        <div className="z-50 absolute w-full h-full top-0 left-0 right-0 bottom-0">
          <div className="loader inset-0 m-auto absolute" />
          <div className="bg-black w-full h-full opacity-15"></div>
        </div>
      )}
      <div className="flex flex-col gap-2 h-full max-w-7xl mx-auto">
        <div className="flex p-2 gap-2 bg-gray-50 sticky top-0 z-10">
          {/* <button>
            <IoIosArrowBack size={24} />
          </button> */}
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
            {keyword && (
              <IoCloseCircleSharp
                className="text-gray-400"
                size={28}
                onClick={handleClearClick}
              />
            )}
            <FaSearch
              className="text-gray-700 mr-4 ml-1"
              size={24}
              onClick={handleRouter}
            />
          </div>
        </div>
        <div className="bg-gray-50 h-full p-4 flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <span className="text-xs font-semibold">
                전체 {str.currency(total)}개
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`w-20 h-7 ${
                  isTv ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'
                } border-gray-300 border rounded-md text-sm`}
                onClick={tvClickHandler}
              >
                방송상품만
              </button>
              <span className="text-gray-200">|</span>
              <LayoutMode onClick={changeLayoutHandler} />
              <span className="text-gray-200">|</span>
              <select
                name="viewSortType"
                className="text-sm bg-transparent outline-none"
                onChange={handleChangeSortType}
                value={sortType}
              >
                <option value="popularity_score_desc">추천높은순</option>
                <option value="sale_price_asc">낮은가격순</option>
                <option value="sale_price_desc">높은가격순</option>
              </select>
            </div>
          </div>
          <div>
            <div
              className={`grid gap-4 gap-y-8 w-full ${
                isGrid
                  ? 'md:grid-cols-6 grid-cols-2'
                  : 'md:grid-cols-3 grid-cols-1'
              }`}
            >
              {assignData &&
                assignData.length > 0 &&
                assignData.map((item) => (
                  <div key={item.pid}>
                    {isGrid ? (
                      <GirdItem item={item} key={item.pid} />
                    ) : (
                      <ListItem item={item} key={item.pid} />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
