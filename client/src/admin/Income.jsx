import { useDispatch, useSelector } from "react-redux";
import { useRedirectLoggedOutUser } from "../hooks/useRedirectLoggedOutUser";
import { Title } from "../router";
import { CgDollar } from "react-icons/cg";
import { getIncome } from "../redux/features/authSlice";
import { useEffect } from "react";


export const Income = () => {

  useRedirectLoggedOutUser("/login");
  const { income } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getIncome());
  }, [dispatch]);
  return (
    <>
      <section>
        <div className="shadow-s1 p-8 rounded-lg  mb-12">
          <Title level={5} className=" font-normal">
            Хувь
          </Title>

          <div className="shadow-s3 py-16 my-16 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
            <CgDollar size={80} className="text-green" />
            <div>
             <Title level={1}>${income?.commissionBalance}</Title>
              <Title>Нийт орлого</Title>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
