import { Caption, Title } from "../../router";
import { commonClassNameOfInput, PrimaryButton } from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllProduct, updateProductByAdmin, getProductById } from "../../redux/features/productSlice";

export const UpdateProductByAdmin = () => {
  useRedirectLoggedOutUser("/login");

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSuccess, isLoading, error  } = useSelector((state) => state.product);

  const [commission, setCommission] = useState(0);

 const save = async (e) => {
    e.preventDefault();

    const formData = { commission };

    await dispatch(updateProductByAdmin({ formData, id }));
    await dispatch(getAllProduct());

    if (isSuccess) {
      navigate("/product/admin");
    }
  };

  return (
    <section className="bg-white shadow-s1 p-8 rounded-xl">
      <Title level={5} className="font-normal mb-5">
        Бараа Шинэчлэх
      </Title>
      <hr className="my-5" />
      <form onSubmit={save}>
        <div className="w-full mb-5">
          <Caption className="mb-2">Хувь *</Caption>
          <input
            type="number"
            name="commission"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className={commonClassNameOfInput}
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <PrimaryButton type="submit" className="rounded-none" disabled={isLoading}>
          {isLoading ? 'Шинэчлэх...' : 'Шинэчлэх'}
        </PrimaryButton>
      </form>
    </section>
    
  );
};
