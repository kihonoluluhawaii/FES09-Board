import { useForm } from 'react-hook-form';
import useCustomAxios from '@hooks/useCustomAxios.mjs';
import { useNavigate } from 'react-router-dom';
import Submit from '@components/Submit';

// const errorStyle = {
//   fontSize: '12px',
//   color: 'red',
//   fontWeight: 'bold'
// };

function Signup2() {

    const navigate = useNavigate()
    const axios = useCustomAxios();
    const { register, handleSubmit, formState: { errors }, setError  } = useForm();

    const onSubmit = async (formData) => {
      try {
        formData.type = 'user'
        
        // 이미지 먼저 업로드
        // 프로필이미지가 없어도 로그인될수있게 조건달기
        if(formData.profileImage.legnth > 0){
            const imageFormData = new FormData();
            imageFormData.append('attach',formData.profileImage[0]);
            const fileRes = await axios('/files',{
                method: 'post',
                headers:{   //  파일업로드시 필요한 설정
                    'Content-Type' : 'multipart/form-data'
                },
                data: imageFormData
            });
            // 서버로부터 응답받은 이미지 이름을 회원정보에 포함
            formData.profileImage = fileRes.data.file.name;
        }else{
            //  profileImage  속성을 제거
            delete formData.proifleImage;
        }
        

      const res = await axios.post('/users/', formData);
        alert(res.data.item.name + '님 로그인 되었습니다. \n로그인 후에 이용하세요');
       navigate('/users/login');
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
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">회원가입</h2>
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
            <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2" htmlFor="name">이름</label>
            <input 
              type="text" 
              id="name" 
              placeholder="이름을 입력하세요"       
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700"      
              { ...register('name', {
                required: '이름을 입력하세요.',
                minLength: {
                    value: 2,
                    message: '이름을 두글자 이상 입력하세요'
                }
              }) }
            />
            { errors.name && <p className="ml-2 mt-1 text-sm text-red-500">{ errors.name.message }</p> }
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2" htmlFor="profileImage">이미지를 추가하셈</label>
            <input 
              type="file"
              accept="image/*" 
              id="profileImage" 
              placeholder="이미지를 선택하세요"       
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700"      
              { ...register('profileImage')}
            />
          </div>

          <div className="mt-14 flex justify-center items-center">
            <Submit >회원가입</Submit>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup2;