import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/ProductComponent";
import LoaderComponent from "../components/LoaderComponent";
import MessageComponent from "../components/MessageComponent";
import { listProducts } from "../actions/productActions";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest products</h1>
      {loading ? (
        <LoaderComponent />
      ) : error ? (
        <MessageComponent variant="danger">{error}</MessageComponent>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
