import React, { useEffect, useRef, useState } from "react";
import { Title } from "../../router";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getAllWonedProductOfUser } from "../../redux/features/productSlice";
import { Table } from "../../components/Table";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export const WinningBidList = () => {
  useRedirectLoggedOutUser("/");
  const dispatch = useDispatch();
  const { wonedproducts } = useSelector((state) => state.product);
  const socketRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { width, height } = useWindowSize();

  // Load user's won products
  useEffect(() => {
    dispatch(getAllWonedProductOfUser());
  }, [dispatch]);

  // Celebrate win
  useEffect(() => {
    if (wonedproducts && wonedproducts.length > 0) {
      setShowConfetti(true);
      setShowModal(true);

      const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
      const modalTimer = setTimeout(() => setShowModal(false), 4000);

      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(modalTimer);
      };
    }
  }, [wonedproducts]);

  // Socket setup
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("outbid", (data) => {
      toast.info(`Та ${data.productName} бараан дээр дэнчингийн давуу эрхээ алдсан байна.`, {
        position: "top-right",
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <section className="shadow-s1 p-8 rounded-lg relative overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} />}

      {/* 🎉 Celebration Modal */}
      {showModal && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-green-400 text-green-700 px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          🎉 Баяр хүргэе та ялсан!
        </div>
      )}

      <div className="flex justify-between items-center">
        <Title level={5} className="font-normal">
          Миний ялсан бараанууд
        </Title>
      </div>

      <br />
      {wonedproducts && wonedproducts.length > 0 ? (
        <Table products={wonedproducts} isWon={true} />
      ) : (
        <div className="text-center py-5">
          <p className="text-gray-500">Бараа байхгүй байна</p>
        </div>
      )}
    </section>
  );
};
