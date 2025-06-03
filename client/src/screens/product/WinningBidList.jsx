import React, { useEffect } from "react";
import { Title } from "../../router";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductOfUser, getAllWonedProductOfUser } from "../../redux/features/productSlice";
import { Table } from "../../components/Table";

export const WinningBidList = () => {

  useRedirectLoggedOutUser("/");
  const dispatch = useDispatch();
  const {wonedproducts} = useSelector((state) => state.product);

  useEffect(() =>{
    dispatch(getAllWonedProductOfUser());

  }, [dispatch]);
  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="flex justify-between">
          <Title level={5} className=" font-normal">
            Ялж буй бараа
          </Title>
        </div>
        <br />
        {wonedproducts && wonedproducts.length > 0 ? (
          <Table products={wonedproducts} isWon={true}/>
        ) : ( 
        <div className="text-center py-5">
          <p className="text-gray-500">Бараа байхгүй байна</p>
        </div>
        )}
      </section>
    </>
  );
};
