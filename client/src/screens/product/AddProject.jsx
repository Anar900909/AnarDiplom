import { CategoryDropDown, Caption, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createProduct } from "../../redux/features/productSlice";

const initialState = {
  title: "",
  description: "",
  price: "",
  height: "",
  lengthpic: "",
  width: "",
  mediumused: "",
  weigth: "",
  category: null,
};

export const AddProduct = () => {
  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setimagePreview] = useState(null);

  const { title, description, price, height, lengthpic, width, mediumused, weigth, category } = product;
  const { isSuccess } = useSelector((state) => state.product);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleimageChange = (e) => {
    setProductImage(e.target.files[0]);
    setimagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("lengthpic", lengthpic);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("mediumused", mediumused);
    formData.append("weigth", weigth);
    formData.append("description", description);
    formData.append("image", productImage);
    if(category){
      formData.append("category", category.value);
    }

    await dispatch(createProduct(formData));
    if(isSuccess){
      navigate("/product");
    }
  };
    

  return (
    <section className="bg-white shadow-s1 p-8 rounded-xl">
      <Title level={5} className="font-normal mb-5">Бараа нэмэх</Title>
      <hr className="my-5" />
      <form onSubmit={handleSubmit}>
        <div className="w-full mb-4">
          <Caption className="mb-2">Гарчиг</Caption>
          <input type="text" value={product?.title} onChange={handleInputChange} name="title" className={`${commonClassNameOfInput}`} placeholder="Title" required />
        </div>

        <div className="py-5">
          <Caption className="mb-2">Ангилал *</Caption>
          <CategoryDropDown
            value={category}
            onChange={(selectedCategory) => setProduct({ ...product, category: selectedCategory })} className={`${commonClassNameOfInput}`} 
          />
        </div>
        {category && (
          <>
        <div className="flex items-center gap-5 my-4">
          <div className="w-1/2">
            <Caption className="mb-2">Өндөр (cm)</Caption>
            <input type="number" name="height" value={product?.height} onChange={handleInputChange} placeholder="" className={`${commonClassNameOfInput}`} />
          </div>
          <div className="w-1/2">
            <Caption className="mb-2">Урт (cm)</Caption>
            <input type="number" name="lengthpic" value={product?.lengthpic} onChange={handleInputChange} placeholder="" className={`${commonClassNameOfInput}`} />
          </div>
        </div>

        <div className="flex items-center gap-5 my-4">
          <div className="w-1/2">
            <Caption className="mb-2">Өргөн (cm)</Caption>
            <input type="number" name="width" value={product?.width} onChange={handleInputChange} placeholder="" className={`${commonClassNameOfInput}`} />
          </div>
          <div className="w-1/2">
            <Caption className="mb-2">Матириал <span className="text-purple-400 italic">(Модон, Төмөрөн, Чулуу гэх мэт...)</span></Caption>
            <input type="text" name="mediumused" value={product?.mediumused} onChange={handleInputChange} placeholder="" className={`${commonClassNameOfInput}`} />
          </div>
        </div>

        <div className="flex items-center gap-5 mt-4">
          <div className="w-1/2">
            <Caption className="mb-2">Жин (kg))</Caption>
            <input type="number" name="weigth" value={product?.weigth} onChange={handleInputChange} placeholder="" className={`${commonClassNameOfInput}`} />
          </div>
          <div className="w-1/2">
            <Caption className="mb-2">Үнэ*</Caption>
            <input type="number" name="price" value={product?.price} onChange={handleInputChange} placeholder="" className={`${commonClassNameOfInput}`} required />
          </div>
        </div>
</>)}
        <div className="mb-4">
          <Caption className="mb-2">Тайлбар *</Caption>
          <textarea name="description" value={product?.description} onChange={handleInputChange} className={`${commonClassNameOfInput}`} rows="5" required />
        </div>

        <div className="mb-4">
          <Caption className="mb-2">Зураг</Caption>
          <input type="file"  className={`${commonClassNameOfInput}`} name="image"  onChange={(e) => handleimageChange(e)} />
          {imagePreview !== null ? (
              <div>
                <img src={imagePreview} alt="" className="mt-5 rounded-lg w-48 h-48 object-cover" />
              </div>
          ) : (
            <p>Зураггүй</p>
          )}
        </div>

        <PrimaryButton type="submit" className="rounded-none my-5">НЭМЭХ</PrimaryButton>
      </form>
    </section>
  );
};
