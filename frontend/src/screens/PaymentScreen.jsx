import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainerComponent from "../components/FormContainerComponent";
import CheckoutStepsComponent from "../components/CheckoutStepsComponent";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.psh("/shipping");
  }

  const [paymentMedthod, setPaymentMedthod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMedthod));
    history.push("/placeorder");
  };

  return (
    <FormContainerComponent>
      <CheckoutStepsComponent step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
        </Form.Group>
        <Col>
          <Form.Check
            type="radio"
            label="PayPal or Credit Card"
            id="PayPal"
            name="paymentMethod"
            value="PayPal"
            checked
            onChange={(e) => setPaymentMedthod(e.target.value)}
          ></Form.Check>
          {/*<Form.Check
            type="radio"
            label="Stripe"
            id="Stripe"
            name="paymentMethod"
            value="Stripe"
            checked
            onChange={(e) => setPaymentMedthod(e.target.value)}
         ></Form.Check>*/}
        </Col>
        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainerComponent>
  );
};

export default PaymentScreen;
