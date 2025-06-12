import React, { useEffect, useState } from "react";
import { Caption, Title } from "../../router";
import {
  commonClassNameOfInput,
  PrimaryButton,
} from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getuserProfile } from "../../redux/features/authSlice";

export const UserProfile = () => {
  useRedirectLoggedOutUser("/login");

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("");
  const [individual, setIndividual] = useState("");

  // Load saved values or fallback to user data
  useEffect(() => {
    dispatch(getuserProfile());

    const savedPhone = localStorage.getItem("user_phone");
    const savedIndividual = localStorage.getItem("user_individual");

    if (savedPhone) setPhone(savedPhone);
    else if (user?.phone) setPhone(user.phone);

    if (savedIndividual) setIndividual(savedIndividual);
  }, [dispatch, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("user_phone", phone);
    localStorage.setItem("user_individual", individual);

    alert("Мэдээлэл түр хадгалагдлаа (localStorage)");
  };

  return (
    <section className="shadow-s1 p-8 rounded-lg">
      <div className="profile flex items-center gap-8">
        <img
          src={user?.photo}
          alt=""
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <Title level={5} className="capitalize">
            {user?.name}
          </Title>
          <Caption>{user?.email}</Caption>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-5 mt-10">
          <div className="w-full">
            <Caption className="mb-2">Нэр</Caption>
            <input
              type="search"
              value={user?.name}
              className={`capitalize ${commonClassNameOfInput}`}
              placeholder="Sunil"
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center gap-5 mt-10">
          <div className="w-1/2">
            <Caption className="mb-2">Холбогдох</Caption>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={commonClassNameOfInput}
              placeholder="Холбогдох дугаар"
            />
          </div>
          <div className="w-1/2">
            <Caption className="mb-2">Email</Caption>
            <input
              type="search"
              value={user?.email}
              className={commonClassNameOfInput}
              placeholder="example@gmail.com"
              disabled
            />
          </div>
        </div>

        <div className="my-8">
          <Caption className="mb-2">Үүрэг</Caption>
          <input
            type="search"
            value={user?.role}
            className={commonClassNameOfInput}
            readOnly
          />
        </div>

        <div className="my-8">
          <Caption className="mb-2">Данс</Caption>
          <input
            type="text"
            value={individual}
            onChange={(e) => setIndividual(e.target.value)}
            className={commonClassNameOfInput}
            placeholder="Дансны дугаар"
          />
        </div>

        <PrimaryButton>Про Шинэчлэх</PrimaryButton>
      </form>
    </section>
  );
};
