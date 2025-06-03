import { Container, Heading } from "../../router";
import { productlists } from "../../utils/data";
import { ProductCard } from "../cards/ProductCard";

export const ProductList = ({products}) => {
  return (
    <>
      <section className="product-home">
        <Container>
          <Heading
            title="Дуудлага худалдаа"
            subtitle=""
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
            {products?.slice(0, 12)?.map((item, index) => (
              <ProductCard item={item} key={index + 1} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};
