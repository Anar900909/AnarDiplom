import { Body, Caption, Container, DateFormatter, Loader, Title } from "../../router";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect, useState } from "react";
import { getAllProduct, getProduct } from "../../redux/features/productSlice";
import { fetchBiddingHistory, placebid, validateBid } from "../../redux/features/biddingSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Table } from "../../components/Table";
import axios from 'axios';

export const ProductsDetailsPage = () => {
    const dispatch = useDispatch();    
    const { id } = useParams();    
    const { product, isLoading } = useSelector((state) => state.product);
    const { history } = useSelector((state) => state.bidding);
    const { user } = useSelector((state) => state.auth); // Get user data
    const isDisabled = product?.isSoldOut || !product?.isverify;
    const [rate, setRate] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const [isBidding, setIsBidding] = useState(false);

    useEffect(() => {
      dispatch(getProduct(id));
    }, [dispatch, id]);

useEffect(() => {
  let interval;
  if (product && !product.isSoldOut) {
    // Initial fetch
    dispatch(fetchBiddingHistory(id));
    
    // Set up polling every 5 seconds
    interval = setInterval(() => {
      dispatch(fetchBiddingHistory(id));
    }, 5000);
  }
  
  return () => clearInterval(interval);
}, [dispatch, id, product]);

useEffect(() => {
  if (!product) return;

  let highestBid = product.price || 0;

  if (history?.length > 0) {
    const validBids = history.filter(bid => bid?.price && !isNaN(bid.price));
    if (validBids.length > 0) {
      highestBid = Math.max(...validBids.map(bid => bid.price));
    }
  }

  // Only update rate if current rate is lower (avoid overwriting user input)
  setRate(prev => (prev < highestBid ? highestBid : prev));
}, [history, product]);

    const incrementBid = () => {
      // Minimum 10% increment
      const minIncrement = rate * 0.1;
      setRate(prev => Math.floor(prev + minIncrement));
    };

    const handleBidChange = (e) => {
      const value = Number(e.target.value);
      if (!isNaN(value)) {
        setRate(value);
      }
    };
      const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

   const save = async (e) => {
  e.preventDefault();
  setIsBidding(true);

  try {
    // First validate the bid
    const validation = await dispatch(validateBid({ 
      productId: id, 
      price: rate 
    })).unwrap();

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // If validation passes, place the bid
    await dispatch(placebid({ 
      price: rate, 
      productId: id 
    })).unwrap();

    toast.success("Bid placed successfully!");
    dispatch(fetchBiddingHistory(id));
    
  } catch (error) {
    toast.error(error.message || "Үлдэгдэл хүрэлцэхгүй байна!");
  } finally {
    setIsBidding(false);
  }
};

  return (
    <>
      <section className="pt-24 px-8">
        <Container>
          <div className="flex justify-between gap-8">
            <div className="w-1/2">
              <div className="h-[70vh]">
                <img src={product?.image?.filePath} alt="" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
            <div className="w-1/2">
              <Title level={2} className="capitalize">
                {product?.title}
              </Title>
              <div className="flex gap-5">
                <div className="flex text-green ">
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStarHalf size={20} />
                  <IoIosStarOutline size={20} />
                </div>
                <Caption>(2 customer reviews)</Caption>
              </div>
              <br />
              <Body>{product?.description?.slice(0, 150) || "No description available."}</Body>

              <br />
              <Caption>Барааний эдлэл</Caption>
              <br />
              <Caption>Баталгаажсан: {product?.isverify ? "Yes" : "No"}</Caption>
              <br />
              <Caption>Дуусах Хугацаа:</Caption>
              <br />
              <div className="flex gap-8 text-center">
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>149</Title>
                  <Caption>Өдөр</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>12</Title>
                  <Caption>Цаг</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>36</Title>
                  <Caption>Минут</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>51</Title>
                  <Caption>Секунд</Caption>
                </div>
              </div>
              <br />
              <Title className="flex items-center gap-2">
                Дуусах:
                <Caption>
                  <DateFormatter date ={product?.createdAt}/>
                  </Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Цаг: <Caption>10:20AM (Ulaanbator)</Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Таний Данс:<Caption>₮{user?.balance?.toFixed(2)} </Caption>
              </Title>
              <Title className="flex items-center gap-2">
                Эхлэх Үнэ:<Caption className="text-3xl">₮{product?.price} </Caption>
              </Title>
               <Title className="flex items-center gap-2">
                Бооцоо тавиж буй Үнэ:<Caption className="text-3xl">₮{rate} </Caption>
              </Title>
              <div className="p-5 px-10 shadow-s3 py-8">
              <form onSubmit={save} className="flex gap-3 justify-between">
                <input 
                  className={commonClassNameOfInput} 
                  type="number" 
                  name="price" 
                  value={rate} 
                  onChange={handleBidChange}
                  min={product?.price * 1.1} // Minimum 10% higher than current
                  step="1"
                />
                <button 
                  type="button" 
                  onClick={incrementBid} 
                  className="bg-gray-100 rounded-md px-5 py-3"
                >
                  <AiOutlinePlus />
                </button>
              
                <button
                  type="submit"
                  className={`py-3 px-8 rounded-lg ${
                    isDisabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : 
                    "bg-green text-white hover:bg-green-600"
                  }`}
                  disabled={isDisabled || isBidding}
                >
                  {isBidding ? "Processing..." : "Place Bid"}
                </button>
              </form>
              </div>
            </div>
          </div>
          <div className="details mt-8">
            <div className="flex items-center gap-5">
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "description" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("description")}>
                Тайлбар
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "auctionHistory" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("auctionHistory")}>
                Бооцооний Түүх
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "reviews" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("reviews")}>
                Үнэлгээ(2)
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "moreProducts" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("moreProducts")}>
                
              </button>
            </div>

            <div className="tab-content mt-8">
              {activeTab === "description" && (
                <div className="description-tab shadow-s3 p-8 rounded-md">
                  <Title level={4}>Тайлбар</Title>
                  <br />
                  <Caption className="leading-7">
                  {product?.description}
                  </Caption>
                
                  <br />
                  <Title level={4}>Барааний Дэлгэрэнгүй</Title>
                  <div className="flex justify-between gap-5">
                    <div className="mt-4 capitalize w-1/2">
                      <div className="flex justify-between border-b py-3">
                        <Title>Ангилал</Title>
                        <Caption>{product?.category.name}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>Өндөр</Title>
                        <Caption> {product?.height}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>Урт</Title>
                        <Caption> {product?.lengthpic}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>Өргөн</Title>
                        <Caption> {product?.width}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>Жин</Title>
                        <Caption> {product?.weigth}</Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Эдлэл</Title>
                        <Caption> {product?.mediumused} </Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Үнэ</Title>
                        <Caption> {product?.price} </Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Зарагдсан</Title>
                        {product?.isSoldOut ? <Caption>Sold Out</Caption> : <Caption> On Stock</Caption>}
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Баталгаажсан</Title>
                       {product?.isverify ? <Caption>Yes</Caption> : <Caption> No</Caption>}
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Оруулсан цаг:</Title>
                        <Caption><DateFormatter date={product?.createdAt}/></Caption>
                      </div>
                      <div className="flex justify-between py-3">
                        <Title>Засагдсан цаг:</Title>
                        <Caption><DateFormatter date={product?.updatedAt}/></Caption>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="h-[60vh] p-2 bg-green rounded-xl">
                        <img src={product?.image?.filePath} alt="" className="w-full h-full object-cover rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "auctionHistory" && <AuctionHistory history={history}/>}
              {activeTab === "reviews" && (
                <div className="reviews-tab shadow-s3 p-8 rounded-md">
                  <Title level={5} className=" font-normal">
                    Үнэлгээ
                  </Title>
                  <hr className="my-5" />
                  <Title level={5} className=" font-normal text-red-500">
                    Тун удахгүй!
                  </Title>
                </div>
              )}
              {activeTab === "moreProducts" && (
                <div className="more-products-tab shadow-s3 p-8 rounded-md">
                  <h1>Ижил бараа</h1>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
export const AuctionHistory = ({ history }) => {
  console.log('Bidding History Data:', history); // Debug log

  if (!history || !Array.isArray(history)) {
    return (
      <div className="shadow-s1 p-8 rounded-lg">
        <Title level={5} className="font-normal">
          Бооцооны Түүх
        </Title>
        <hr className="my-5" />
        <div className="text-red-500">
          {history === null ? "Loading..." : "No bidding history available"}
        </div>
      </div>
    );
  }

  // Sort by price (highest first) or by date (newest first)
  const sortedHistory = [...history].sort((a, b) => 
    b.price - a.price // or: new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="shadow-s1 p-8 rounded-lg">
      <Title level={5} className="font-normal">
        Бооцооны Түүх — {sortedHistory.length} бооцоо
      </Title>
      <hr className="my-5" />

      {sortedHistory.length === 0 ? (
        <h2 className="m-2">Бооцооны Түүх байхгүй байна!</h2>
      ) : (
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-5">Өдөр</th>
                <th className="px-6 py-3">Бооцоо үнэ (₮)</th>
                <th className="px-6 py-3">Хэрэглэгч</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((item, index) => (
                <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                  <td className="px-6 py-4">
                    <DateFormatter date={item?.createdAt} />
                  </td>
                  <td className="px-6 py-4">₮{item?.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {item?.user?.name || 'Unknown User'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};