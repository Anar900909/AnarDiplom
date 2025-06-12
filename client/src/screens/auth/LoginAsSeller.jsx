import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Caption, Container, CustomNavLink, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {toast} from "react-toastify";
import { loginUserAsSeller } from "../../redux/features/authSlice";
import {Loader} from "../../router/index.js";

const initialState = {
  email: "",
  password: "",
};

export const LoginAsSeller = () => {

      const dipatch = useDispatch();
      const [formData, setFormData] = useState(initialState);
      const {email,password} = formData;
      const {isLoading} = useSelector(state => state.auth)
      
      const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
      };
    
     const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
          return toast.error("Бүгдийн бөглнө үү!");
        }

        const userData = { email, password };
        dipatch(loginUserAsSeller(userData));
      };
          
    
  return (
    <>
      {isLoading && <Loader/>}
      <section className="regsiter pt-16 relative">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Борлуулагч болох
              </Title>
              <div className="flex items-center gap-3">
                <Title level={5} className="text-green font-normal text-xl">
                  Гэр
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  /
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  Борлуулагч
                </Title>
              </div>
            </div>
          </Container>
        </div>
        <form onSubmit={handleLogin} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Шинэ борлуулагч</Title>
            <p className="mt-2 text-lg">
               <CustomNavLink href="/create-account"></CustomNavLink>
            </p>
          </div>

          <div className="py-5 mt-8">
            <Caption className="mb-2">Email бөглнө үү</Caption>
            <input type="email" name="email"  value={email} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Enter Your Email" />
          </div>
          <div>
            <Caption className="mb-2">Пассворд бөглнө үү</Caption>
            <input type="password" name="password" value={password} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Enter Your Password" />
          </div>
          <div className="flex items-center gap-2 py-4">
            <input type="checkbox" />
            <Caption></Caption>
          </div>
          <PrimaryButton className="w-full rounded-none my-5 uppercase">Борлуулагч болох</PrimaryButton>
          <div className="text-center border py-4 rounded-lg mt-4">
            <Title></Title>
            <div className="flex items-center justify-center gap-5 mt-5">
              <button className="flex items-center gap-2 bg-red-500 text-white p-3 px-5 rounded-sm">
                <FaGoogle />
                <p className="text-sm">GOOGLE -ээр нэвтрэх</p>
              </button>
              <button className="flex items-center gap-2 bg-indigo-500 text-white p-3 px-5 rounded-sm">
                <FaFacebook />
                <p className="text-sm">FACEBOOK -ээр нэвтрэх</p>
              </button>
            </div>
          </div>
          <p className="text-center mt-5">
        <span className="text-green underline"></span> &
            <span className="text-green underline">  </span> .
          </p>
        </form>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};
