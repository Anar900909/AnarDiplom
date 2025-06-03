import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Caption, Container, CustomNavLink, Loader, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import { register, RESET } from "../../redux/features/authSlice";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Register = () => {
  const dipatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const {name,email,password,confirmPassword} = formData;
  const {isLoading,isSuccess,isLoggedIn,message, isError} = useSelector(state => state.auth)
  
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleRegister = (e) => {
     e.preventDefault();

     if(!name || !email || !password || !confirmPassword){
      return toast.error("Бүгдийн бөглнө үү!");
     }
     if(password.length < 8){
      return toast.error("Хамгийн багадаа 8 үсэг тоо!");
     }
     if(password !== confirmPassword){
      return toast.error("Password-буруу!");
     }

     const userData = {
      name,
      email,
      password,
     };
     dipatch(register(userData));
  };

  useEffect(() =>{
    if(isSuccess && isLoggedIn){
      navigate("/login");
    }
    if(isError){
      toast.error(message || "Registraction failed");
    }

    return()=>{
      dipatch(RESET());
    };
  
  },[dipatch, isLoggedIn, isSuccess, isError, message, navigate]);

  return (
    <>
    {isLoading && <Loader/>}
      <section className="regsiter pt-16 relative">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Бүртгүүлэх
              </Title>
              <div className="flex items-center gap-3">
                <Title level={5} className="text-green font-normal text-xl">
                  Гэр
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  /
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  Бүртгүүлэх
                </Title>
              </div>
            </div>
          </Container>
        </div>
        <form onSubmit={handleRegister} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Бүртгүүлэх</Title>
            <p className="mt-2 text-lg">
              <CustomNavLink href="/login"></CustomNavLink>
            </p>
          </div>
          <div className="py-5">
            <Caption className="mb-2"> Нэр*</Caption>
            <input type="text" name="name" value = {name} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Нэр ээ бичнэ үү" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2"> Email*</Caption>
            <input type="email" name="email" value = {email}  onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Email ээ бичнэ үү" required />
          </div>
          <div>
            <Caption className="mb-2"> Пассворд*</Caption>
            <input type="password" name="password" value = {password}  onChange={handleInputChange}  className={commonClassNameOfInput} placeholder="Пассворд оо бичнэ үү" required />
          </div>
          <div>
            <Caption className="mb-2">  Баталгаажуулах пассворд*</Caption>
            <input type="password" name="confirmPassword" value = {confirmPassword}  onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Баталгаажуулах пассворд" />
          </div>
          <div className="flex items-center gap-2 py-4">
            <input type="checkbox" />
            <Caption>Би бүртгүүлэхийг зөвшөөрч байна</Caption>
          </div>
          <PrimaryButton className="w-full rounded-none my-5"> Баталгаажуулах</PrimaryButton>
          <div className="text-center border py-4 rounded-lg mt-4">
            <Title></Title>
            <div className="flex items-center justify-center gap-5 mt-5">
              <button className="flex items-center gap-2 bg-red-500 text-white p-3 px-5 rounded-sm">
                <FaGoogle />
                <p className="text-sm">GOOGLE ээр бүртгүүлэх</p>
              </button>
              <button className="flex items-center gap-2 bg-indigo-500 text-white p-3 px-5 rounded-sm">
                <FaFacebook />
                <p className="text-sm">FACEBOOK ээр бүртгүүлэх</p>
              </button>
            </div>
          </div>
          <p className="text-center mt-5">
             <span className="text-green underline"></span> 
            <span className="text-green underline">  </span> .
          </p>
        </form>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};
