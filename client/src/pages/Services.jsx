import React, { useState } from "react";
import { useSelector } from "react-redux";

const Services = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setShowMessage(true); // Show the message right away or do something else
  };

  const longText = `Анхааруулга: Таны татсан мөнгө ажлийн 1-3 хоногт таны дансанд орох болон тийм учраас та заавал өөрийн хувь мэдээлэл хэсэгт өөрийн дансийг бичих ёстой зарим тохиолдолд таньтай эмайл юм уу утсаар ярьж таныг баталгаажуулна. Баярлалаа!`;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mt-14 text-center py-8">Данс цэнэглэх</h1>
      <h1 className="text-3xl font-bold mt-11 text-left py-4">Хаан банк: Будхүү Анар</h1>
      <h1 className="text-3xl text-left py-4">Таны гүйлгээний утга: {user?.email}</h1>
      <h1 className="text-3xl mb-6 text-left py-4">Таны Дансанд ₮{user?.balance} төг байна</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <img
          src="/images/common/Qr_code_SelfieDuMacaque.png"
          alt="LogoImg"
          className="w-full object-cover"
        />
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Татаж байна..." : "Мөнгө татах"}
        </button>

        {showMessage && (
          <p className="mt-4 text-lg text-gray-800 whitespace-pre-line">
            {longText}
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
