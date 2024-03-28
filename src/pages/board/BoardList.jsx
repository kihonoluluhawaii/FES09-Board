
import Button from "@components/Button";
import Pagination from "@components/Pagination";
import Search from "@components/Search";
import useCustomAxios from "@hooks/useCustomAxios.mjs";
import BoardListItem from "@pages/board/BoardListItem";
import { memberState } from "@recoil/user/atoms.mjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";


function BoardList(){
  // const [data, setData] = useState(null);
  const navigate = useNavigate();
  const axios = useCustomAxios();
  const [searchParams, setSearchParams] = useSearchParams();

 
  // const fetchBoardList = async () =>{
  //   const response = await axios.get('/posts');
  //   setData(response.data)
  // }

  // useEffect(()=>{
  //   fetchBoardList();
  // }, [])

 

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['posts', 'page', searchParams.get('page')],
    queryFn: () => axios.get('/posts', { params: { page: searchParams.get('page'), limit: import.meta.env.VITE_POST_LIMIT, keyword: searchParams.get('keyword') }}),
    select: response => response.data,
    // staleTime: 1000*100 // 쿼리 실행 후 캐시가 유지되는 시간(기본, 0)
    suspense: true,
    eepPreviousData : true
  });

  useEffect(()=>{

    refetch();
  },[searchParams.toString()])

  //  검색 요청시 주소의 query string 수정
  const handleSearch = (keyword) =>{
    searchParams.set('keyword',keyword)
    searchParams.set('page',1)
    setSearchParams(searchParams)
  }

  const user = useRecoilValue(memberState);
  const handleNewPost = () =>{
    if(!user){
      const gotoLoign = confirm('로그인 후 이용 가능합니다. \n 로그인 페이지로 이동하시겠습니까?')
      gotoLoign && navigate('/users/login')
    }else{
      navigate('/boards/new')
    }
  }
  
  const itemList = data?.item?.map(item=><BoardListItem key={item._id}
                                                        item={ item }/>);

  return (
    <>
      <div>
        <section className="min-w-80 p-4">
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-gray-700">게시물 목록 조회</h2>
          </div>
          <div className="flex justify-end mr-4 pd-4">
            <Search onClick={handleSearch} />
            <Button onClick={handleNewPost}>글쓰기</Button>
          </div>
        
          { itemList && (
            <table className="border-collapse w-full table-fix text-gray-700">
              <colgroup>
            <col className="w-[10%] sm:w-[10%]" />
            <col className="w-[60%] sm:w-[40%]" />
            <col className="w-[30%] sm:w-[15%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[25%]" />
          </colgroup>
            <thead>
              <tr className="border-b border-solid broder-gray-200">
                <th className="p2 whitespace-nowrap">번호</th>
                <th className="p2 whitespace-nowrap">제목</th>
                <th className="p2 whitespace-nowrap">글쓴이</th>
                <th className="p2 whitespace-nowrap hidden sm:table-cell">조회</th>
                <th className="p2 whitespace-nowrap hidden sm:table-cell">작성일</th>
              </tr>
            </thead>
            <tbody>
              { isLoading && (
                <tr><td colSpan="5">로딩중...</td></tr>
              )}
              { error && (
                <tr><td>{ error.message }</td></tr>
              )}
              { itemList }
            </tbody>
          </table>
         
         )}
          
          <hr/>
        </section>
         <Pagination totalPage={ data?.pagination.totalPages }  current={ data?.pagination.page }/>
         
      </div>
    </>
  );
}

export default BoardList;