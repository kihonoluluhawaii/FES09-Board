
import Button from "@components/Button";
import useCustomAxios from "@hooks/useCustomAxios.mjs";
import { memberState } from "@recoil/user/atoms.mjs";
import { useQuery } from "@tanstack/react-query";

import {  Outlet, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

function BoardDetail(){
  const axios = useCustomAxios(memberState)
  const { _id } = useParams();
  // const [ data, setData ] = useState();
  const navigate = useNavigate();
  const user = useRecoilValue(memberState); // 사용자 정보 꺼내기

  const { data } = useQuery({
    queryKey: [`/posts/${_id}`],
    queryFn: ()=>axios.get(`/posts/${_id}`),
    select: response => response.data
  })
  // const fetchDetail = async () =>{
  //     const res = await axios.get(`/posts/${_id}`)
  //     setData(res.data)
  //   }

  // useEffect(()=>{
  //   fetchDetail();
  // },[])

  //  삭제
  const handleDelete = async () => { 
    await axios.delete(`/posts/${_id}`)
    alert('삭제되었습니다.')
    navigate('/boards')
  }

  const item = data?.item
  return (
    <>

      <div className="container mx-auto mt-4 px-4">
        {data && (
            <section className="mb-8">
                      
            <div className="font-semibold text-right text-xl text-gray-400">제목 : {item.title}</div>
            <div className="text-right text-gray-400">작성자 : {item.user.name}</div>
            <div>
             <pre className="w-full p-2 whitespace-pre-wrap"> {item.content}</pre>
              <hr/>
            </div>
            <div className="flex justify-end my-4">
              <Button className="btn" to="/boards" onClick={()=>navigate('/boards')}>목록</Button>
              { user?._id === item.user._id && <Button bgColor="red" type="button" onClick={handleDelete}>삭제</Button>}
            </div>
            </section>
        )}
       
      <Outlet />
      </div>
    </>
  );
}

export default BoardDetail;