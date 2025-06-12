import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBalance, getSingleUser } from "../redux/features/authSlice";
import { PrimaryButton } from "../router";

const UpdateUserBalance = () => {
  const { id } = useParams();
  const [newBalance, setNewBalance] = useState("");
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [id, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateBalance({ userId: id, newBalance: Number(newBalance) }))
      .unwrap()
      .then(() => {
        alert("Дансийг амжилттай өөрчиллөө!");
        setNewBalance("");
        dispatch(getSingleUser(id)); // Refresh user data
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  if (isLoading) return <p>Loading user data...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <section className="p-8">
      <h2 className="text-xl mb-4 font-bold">{user.name}</h2>
      <div className="w-full mb-5">
      <p className="mb-2">Одоогийн дансны Үлдэгдэл: ₮{user.balance || 0}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <input
          type="number"
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
          className="p-2 border rounded"
          placeholder="Данс өөрчлөх"
          required
          min="0"
          step="0.01"
        />
        
        <PrimaryButton type="submit" className="rounded-none" disabled={isLoading}>
               {isLoading ? 'Шинэчлэх...' : 'Шинэчлэх'}
      </PrimaryButton>
      
      </form>
    </section>




    // <section className="bg-white shadow-s1 p-8 rounded-xl">
    //       <Title level={5} className="font-normal mb-5">
    //         Бараа Шинэчлэх
    //       </Title>
    //       <hr className="my-5" />
    //       <form onSubmit={save}>
    //         <div className="w-full mb-5">
    //           <Caption className="mb-2">Хувь *</Caption>
    //           <input
    //             type="number"
    //             name="commission"
    //             value={commission}
    //             onChange={(e) => setCommission(e.target.value)}
    //             className={commonClassNameOfInput}
    //             disabled={isLoading}
    //           />
    //         </div>
    //         {error && <p className="text-red-500 mb-3">{error}</p>}
    //         <PrimaryButton type="submit" className="rounded-none" disabled={isLoading}>
    //           {isLoading ? 'Шинэчлэх...' : 'Шинэчлэх'}
    //         </PrimaryButton>
    //       </form>
    //     </section>
  );
};

export default UpdateUserBalance;