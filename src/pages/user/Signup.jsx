import useCustomAxios from "@hooks/useCustomAxios.mjs";
import { memberState } from "@recoil/user/atoms.mjs";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {  useSetRecoilState } from "recoil";

{/* routes.jsx 
    children 안에 추가
    {
        path: "/users/signup",
        element: <Signup />
      }                         */}

      
const errorStyle = {
    fontSize: '12px',
    color: 'red',
    fontWeight: 'bold'
  };

function Signup(){
    const navigate = useNavigate();
    const setUser = useSetRecoilState(memberState)
    const axios = useCustomAxios();
    const { register, handleSubmit, formState: {errors}} = useForm()

    const onSubmit = async (formData) => {
        try {
          const res = await axios.post('/users/', {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            type: 'user'
          });
          setUser({
            id: res.data.item._id,
            name: res.data.item.name,
            token: res.data.item.token,
          });
          alert('회원가입에 성공하였습니다.');
          navigate('/')
        } catch (err) {
          alert(err.response?.data.message);
        }
      };
    return(
    <>
        <h2>회원가입</h2>
        <form onSubmit={ handleSubmit(onSubmit) }>
          <label htmlFor="email">사용할 이메일</label>
          <input type="text" id="email" { ...register('email', {
            required: '이메일을 입력하세요.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '이메일 형식이 아닙니다.'
            } 
          }) } />
          <br />
          { errors && <div style={ errorStyle }>{ errors.email?.message }</div> }
          <label htmlFor="password">사용할 비밀번호</label>
          <input type="password" id="password" { ...register('password', {
            required: "비밀번호는 필수 입니다.",
            minLength: 8
          }) } />
          <br />
          <label htmlFor="name">사용할 닉네임</label>
          <input type="text" id="name" { ... register('name',{
            required: '사용할 닉네임을 입력하세요.',
            minLength: 2
          })} />
          { errors && <div style={ errorStyle }>{ errors.password?.message }</div> }
          <button type="submit">회원가입</button>
        </form>
      </>
      )
}

export default Signup;