import { TiEyeOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { NavLink } from "react-router-dom";

export const Table = ({products, isWon, isAdmin,currentUserId, handleSellProduct, handleDeleteProduct}) => {

  return (
   
    
    <div className="relative overflow-x-auto rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
 <thead>
  <tr>
    <th className="px-6 py-5">Гарчиг</th>
    <th className="px-6 py-3">Хувь</th>
    <th className="px-6 py-3">Үндсэн үнэ</th>
    <th className="px-6 py-3">Одоогийн үнэ</th>
    <th className="px-6 py-3">Зураг</th>
    
    {!isWon && (
      <>
        <th className="px-6 py-3">
          Баталгаажсан
        </th>
    {!isAdmin && (
     <th className="px-6 py-3">
      Зарагдсан
      </th>
      )}
      <th className="px-6 py-3">
          Засах
        </th>
      </>
    )}
  </tr>
</thead>
<tbody>
  {products?.map((product, index) => (
    <tr className="bg-white border-b hover:bg-gray-50" key={index}>
      <td className="px-6 py-4">{product?.title?.slice(0, 15)}...</td>
      <td className="px-6 py-4">{product?.commission}%</td>
      <td className="px-6 py-4">{product?.price}</td>
      <td className="px-6 py-4">{product?.biddingPrice}</td>
      <td className="px-6 py-4">
        <img className="w-10 h-10 rounded-md" src={product?.image?.filePath} alt="Product" />
      </td>

      {/* VERIFY COLUMN (conditionally render if not isWon) */}
      {!isWon && (
        <>
        <td className="px-6 py-4">
          {product?.isverify ? (
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-green me-2"></div> Тийм
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div> Үгүй
            </div>
          )}
        </td>
     

      {/* SOLD COLUMN */}
      <td className="px-6 py-4">
        {!isAdmin && (
          product?.isSoldout ? (
            <button className="bg-red-500 text-white py-1 px-3 rounded-lg" disabled>
              Зарагдсан
            </button>
          ) : (
            <button
              onClick={() => handleSellProduct(product._id)}
              disabled={!product?.isverify}
              className={`py-1 px-3 rounded-lg ${
                product?.isverify ? "bg-green text-white" : "bg-gray-300 text-black cursor-not-allowed"
              }`}
            >
              Зарах
            </button>
          )
        )}
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4 text-center flex items-center gap-3 mt-1">
        {isAdmin ? (
        <NavLink to={`/product/admin/update/${product._id}`} type = "button" className="font-medium text-indigo-500">
          <CiEdit size={25} />
        </NavLink>
        ) : (
        <NavLink to={`/product/update/${product._id}`} type = "button" className="font-medium text-green">
          <CiEdit size={25} />
        </NavLink>
          )
        }
        <button className="font-medium text-red-500" onClick={() => handleDeleteProduct(product._id)}>
        <MdOutlineDeleteOutline size={25} />
        </button>
      </td>
    </> 
    )}
    {isWon && (
      <td className="py-3 px-6">
        <button className="bg-green text-white py-1 px-3 rounded-lg" disabled>
          Ялсан
        </button>
      </td>
    )}
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

