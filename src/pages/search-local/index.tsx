import LayoutMode from '@/components/layout/LayoutMode';
import { str } from '@/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoCloseCircleSharp } from 'react-icons/io5';
import GirdItem from '@/components/gridItem/GridItem';
import ListItem from '@/components/listItem/ListItem';
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

const AUTH_KEY_DEV: string = '105578c7-00c9-47c6-b140-a0870214db0e';

export default function Search() {
  const router = useRouter();

  const params: any = router.query;
  const [query, setQuery] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [sortType, setSortType] = useState<string>('');
  const [page, setPage] = useState<number>(-1);
  const [limit, setLimit] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<DataType[]>([]);
  const [assignData, setAssignData] = useState<DataType[]>([]);
  const [isTv, setTv] = useState<boolean>(false);
  const [isGrid, setGrid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // let url: string = 'https://aiaas-dev.buzzni.com/api/search';
  let url: string = 'http://192.168.2.49:8000/search';

  const handleKeywordChange = (e: any) => {
    const value = e?.target?.value;
    setKeyword(value);
  };

  const handleSearchClickHandler = () => {
    setTv(false);
    setSortType('popularity_score_desc');
    setQuery(keyword);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      e.stopPropagation();
    }

    if (e.key === 'Enter' && keyword !== '') {
      // handleRouter();
      // setTimeout(() => inputRef.current?.blur(), 300);
      setTv(false);
      setSortType('popularity_score_desc');
      setQuery(keyword);
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
    if (sortType !== e.targetValue) {
      setSortType(e.target.value);
    }
  };

  const handleRouter = () => {
    const data: any = {
      query: query,
      order: sortType,
      offset: 0,
      limit: limit,
    };

    router.push('?' + new URLSearchParams(data).toString());
  };

  const fetchData = async (params: any, isNew: boolean = true) => {
    if (!query || isTv) return;

    if (data) {
      url += '?' + new URLSearchParams(params).toString();
      setLoading(true);
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

      await setAssignData(
        isNew ? result?.results : [...assignData, ...result?.results]
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    setAssignData(
      isTv ? [...assignData.filter((item) => item.is_tv_product)] : [...data]
    );
  }, [isTv]);

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      const { query, order, offset, limit } = params;

      setQuery(query || initKeyword);
      setKeyword(query || initKeyword);
      setSortType(order || 'popularity_score_desc');
      setPage(0);
      setLimit(limit || 20);

      fetchData(params, true);
    }
  }, [router]);

  useEffect(() => {
    if (query && !isTv) {
      handleRouter();
    }
  }, [query, sortType]);

  useEffect(() => {
    if (query && page > 0) {
      const data = {
        query: query,
        order: sortType,
        offset: page || 0,
        limit: limit,
      };

      fetchData(data, false);
    }
  }, [page]);

  // Observer 콜백
  const handleObserver: IntersectionObserverCallback = (entries: any) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (assignData.length > 0) {
      // console.log(assignData);
    }
  }, [assignData]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <div id="main" className="flex flex-col gap-1 h-full max-w-7xl mx-auto">
        <div className="flex p-2 gap-2 bg-gray-50 sticky top-0 z-10">
          {/* <button>
            <I oIosArrowBack size={24} />
          </button> */}
          <div className="rounded-full bg-gray-200 flex w-full items-center">
            <input
              name="keyword"
              ref={inputRef}
              type="text"
              value={keyword}
              className="m-2 bg-transparent w-full h-7 text-sm p-2 outline-none"
              placeholder="검색어를 입력해주세요."
              onChange={handleKeywordChange}
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
              onClick={handleSearchClickHandler}
            />
          </div>
        </div>
        <div className="bg-gray-50 h-full p-4 flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <span className="text-xs font-semibold">
                전체 {total ? str.currency(total) : 0} 개
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
              {sortType && (
                <select
                  name="viewSortType"
                  className="text-sm bg-transparent outline-none"
                  onChange={handleChangeSortType}
                  value={sortType}
                >
                  <option value="popularity_score_desc">추천순</option>
                  <option value="sale_price_asc">낮은가격순</option>
                  <option value="sale_price_desc">높은가격순</option>
                </select>
              )}
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
                assignData?.length > 0 &&
                assignData?.map((item, idx) => (
                  <div key={`item.pid${idx}`}>
                    {isGrid ? (
                      <GirdItem item={item} key={item.pid} />
                    ) : (
                      <ListItem item={item} key={item.pid} />
                    )}
                  </div>
                ))}
            </div>
            {/* <div className="w-full h-dvh flex flex-col items-center">
              <span className="text-center text-sm text-gray-700 align-middle inline-block mt-48">
                검색 결과가 없습니다.
              </span>
            </div> */}
            <div ref={loaderRef}>
              {loading && (
                // <div className="z-50 absolute w-full h- top-0 left-0 right-0 bottom-0">
                //   <div className="loader inset-0 m-auto absolute" />
                //    <div className="bg-black w-full h-full opacity-15"></div>
                // </div>
                <div className="w-full text-center my-10">
                  <div className="loader inset-0 mx-auto" />
                  {/* <div className="bg-black w-full h-full opacity-15"></div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
