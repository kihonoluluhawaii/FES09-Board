import { useForm } from 'react-hook-form';
import useCustomAxios from '@hooks/useCustomAxios.mjs';
import { useSetRecoilState } from 'recoil';
import { memberState } from '@recoil/user/atoms.mjs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Submit from '@components/Submit';

// const errorStyle = {
//   fontSize: '12px',
//   color: 'red',
//   fontWeight: 'bold'
// };

function Login() {
  const location = useLocation();
    const setUser = useSetRecoilState(memberState);
    const navigate = useNavigate()
    const axios = useCustomAxios();
    const { register, handleSubmit, formState: { errors }, setError  } = useForm({
        values: {
          email: 'abcabc2@naver.com',
          password: '22222222'
        }
      });
    
    const onSubmit = async (formData) => {
      try {
      const res = await axios.post('/users/login', formData);
      // 사용자 정보를 recoil에 저장 
        setUser({
          _id: res.data.item._id,
          name: res.data.item.name,
          profile: res.data.item.profileImage,
          token: res.data.item.token,
        });
        alert(res.data.item.name + '님 로그인 되었습니다.');
       navigate(location.state?.from ? 'location.state?.from' : '/');
    } catch (err) {
      if(err.response?.data.errors){
        err.response.data.errors.forEach((error)=>setError(err.path, {message: error.msg}))
      }else if(err.response?.data.message){
        alert(err.response?.data.message);
      }
      
    }
  };

  return (
    
      <div className="min-w-80 flex-grow flex items-center justify-center">
      <div className="p-8 shadow-md rounded-lg w-full max-w-md dark:bg-gray-600">
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">로그인</h2>
        </div>

        <form onSubmit={ handleSubmit(onSubmit) }>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2" htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email" 
              placeholder="이메일을 입력하세요"       
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700"      
              { ...register('email', {
                required: '이메일을 입력하세요.',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '이메일 형식이 아닙니다.'
                } 
              }) }
            />
            { errors.email && <p className="ml-2 mt-1 text-sm text-red-500">{ errors.email.message }</p> }
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2" htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              placeholder="비밀번호를 입력하세요" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700" 
              { ...register('password', {
                required: "비밀번호를 입력하세요.",
              }) } 
            />
            { errors.password && <p className="ml-2 mt-1 text-sm text-red-500">{ errors.password.message }</p> }
            <Link className="block mt-6 ml-auto text-gray-500 dark:text-gray-300 hover:underline" to="#">비밀번호를 잊으셨나요?</Link>
          </div>
          <div className="mt-14 flex justify-center items-center">
            <Submit>로그인</Submit>
            <Link className="ml-8 text-blue-500 hover:underline" to="/users/signup">회원가입</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;