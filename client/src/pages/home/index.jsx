import React, { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Modal, ModalHeader, ModalBody } from "../../components/modal";
import client from "../../utils/client";
import useStoreContext from "../../store";

function InitialPlans(props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user, setShowInitialPlans, signOutUser, auth } = props;
  const { id, accessToken } = auth;
  const { register, handleSubmit } = useForm({ defaultValues: user });

  const userName = `${user.firstname} ${user.lastname}`;

  const toggleCheckout = () => {
    setShowCheckout(!showCheckout);
  };

  const cardOptions = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#aab7c4",
        color: "#000",
        fontWeight: 500,
        fontSize: "16px",
        ":-webkit-autofill": {
          color: "#fce883",
        },
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        iconColor: "#FF7961",
        color: "#FF7961",
      },
    },
  };

  const onPlanSubmit = async (data) => {
    try {
      setLoading(true);
      const { plan } = data;
      setSelectedPlan(plan);
      if (plan === "free") {
        await client.patch(
          `users/${id}`,
          { plan },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setShowInitialPlans(false);
        setLoading(false);
      } else {
        setLoading(false);
        setShowCheckout(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onPaymentSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setShowCheckout(false);
    }
    try {
      if (selectedPlan === "free") {
        setLoading(true);
        const { email } = user;
        const response = await client.post(
          "/subscription/delete",
          { email },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log(response);
      } else {
        setLoading(true);
        const { email, customerID } = user;
        const { data } = await client.post(
          "/subscription/create",
          { email, customerId: customerID, plan: selectedPlan },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const { clientSecret } = data;
        const response = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            receipt_email: email,
            card: elements.getElement(CardElement),
            billing_details: {
              name: userName,
            },
          },
        });
        console.log(response);
      }
      setLoading(false);
      setShowInitialPlans(false);
      setShowCheckout(false);
    } catch (error) {
      setLoading(false);
      setError(`Payment failed : ${error.message}`);
      console.log(error);
    }
  };

  return (
    user && (
      <Fragment>
        <div>
          <Modal isOpen={showCheckout}>
            <Fragment>
              <ModalHeader>
                <p>Pay with your card</p>
                <p className="text-sm font-semibold text-gray-400 mt-2">
                  Subscribing to&nbsp;
                  <span className="capitalize text-indigo-500 font-semibold">
                    {selectedPlan}
                  </span>
                  &nbsp;plan
                </p>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="my-5 rounded bg-red-50 border border-red-300 p-5 text-center text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={onPaymentSubmit}>
                  <CardElement options={cardOptions} />
                  <div className="flex flex-row gap-4 mt-4">
                    <button
                      type="submit"
                      disabled={!stripe}
                      className="text-sm px-6 py-1 mt-4 text-white shadow focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                    >
                      {loading ? "Subscribing" : "Subscribe"}
                    </button>
                    <button
                      onClick={toggleCheckout}
                      type="submit"
                      className="text-sm px-6 py-1 mt-4 text-white focus:outline-none bg-red-500 rounded hover:bg-red-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </ModalBody>
            </Fragment>
          </Modal>
        </div>
        <div className="flex flex-col justify-center items-center mt-20">
          <div className="w-1/2 lg:w-2/4 space-y-3">
            <p className="text-2xl text-center mb-5">
              Hello <span className="text-indigo-500">{userName}</span>
            </p>
            <form onSubmit={handleSubmit(onPlanSubmit)}>
              <div className="flex flex-col">
                <div className="mb-5">
                  <p className="text-center">
                    Please select a plan to continue
                  </p>
                </div>
                <div className="flex flex-col p-4 bg-white shadow rounded-lg mb-5">
                  <label className="inline-flex items-start">
                    <input
                      type="radio"
                      value="free"
                      {...register("plan")}
                      className="form-radio h-5 w-5 text-gray-600"
                    />
                    <div className="ml-2 text-gray-700 -mt-1">
                      <p className="font-semibold">
                        Free Plan - <span>&#8377;</span> 0&nbsp;
                        <span className="text-xs text-gray-500">(monthly)</span>
                      </p>
                      <p className="text-light text-sm text-gray-500">
                        Subscribe to Free Plan and get 1 Joke.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="flex flex-col p-4 bg-white shadow rounded-lg mb-5">
                  <label className="inline-flex items-start">
                    <input
                      type="radio"
                      value="basic"
                      {...register("plan")}
                      className="form-radio h-5 w-5 text-gray-600"
                    />
                    <div className="ml-2 text-gray-700 -mt-1">
                      <p className="font-semibold">
                        Basic Plan - <span>&#8377;</span> 100&nbsp;
                        <span className="text-xs text-gray-500">(monthly)</span>
                      </p>
                      <p className="text-light text-sm text-gray-500">
                        Subcribe to the Basic Plan and get 5 Jokes.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="flex flex-col p-4 bg-white shadow rounded-lg mb-5">
                  <label className="inline-flex items-start">
                    <input
                      type="radio"
                      value="pro"
                      {...register("plan")}
                      className="form-radio h-5 w-5 text-gray-600"
                    />
                    <div className="ml-2 text-gray-700 -mt-1">
                      <p className="font-semibold">
                        Pro Plan - <span>&#8377;</span> 500&nbsp;
                        <span className="text-xs text-gray-500">(monthly)</span>
                      </p>
                      <p className="text-light text-sm text-gray-500">
                        Subcribe to the Pro Plan and get 10 Jokes.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="inline-flex justify-center items-center">
                  <button
                    type="submit"
                    className="text-md px-6 py-1 my-4 text-white shadow focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                  >
                    {loading ? "Subscribing" : "Subscribe"}
                  </button>
                </div>
                <div className="inline-flex justify-center items-center">
                  <p className="text-gray-500">Or</p>
                </div>
                <div className="inline-flex justify-center items-center">
                  <button
                    onClick={signOutUser}
                    className="text-sm px-6 py-1 my-4 text-white focus:outline-none bg-red-500 rounded hover:bg-red-600 transition duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
    )
  );
}

function UserPlans(props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user, setShowPlans, auth } = props;
  const { accessToken } = auth;
  const { register, handleSubmit } = useForm({ defaultValues: user });

  const userName = user.firstname + user.lastname;

  const toggleCheckout = () => {
    setShowCheckout(!showCheckout);
  };

  const cardOptions = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#aab7c4",
        color: "#000",
        fontWeight: 500,
        fontSize: "16px",
        ":-webkit-autofill": {
          color: "#fce883",
        },
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        iconColor: "#FF7961",
        color: "#FF7961",
      },
    },
  };

  const onPlanSubmit = async (data) => {
    try {
      const { plan } = data;
      setSelectedPlan(plan);
      setShowCheckout(true);
    } catch (error) {
      console.log(error);
      setShowPlans(false);
    }
  };

  const onPaymentSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setShowPlans(false);
      setShowCheckout(false);
    }
    try {
      if (selectedPlan === "free") {
        setLoading(true);
        const { email } = user;
        const response = await client.post(
          "/subscription/delete",
          { email },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log(response);
      } else {
        setLoading(true);
        const { email, customerID } = user;
        const { data } = await client.post(
          "/subscription/create",
          { email, customerId: customerID, plan: selectedPlan },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const { clientSecret } = data;
        const response = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: userName,
            },
          },
        });
        console.log(response);
      }
      setLoading(false);
      setShowPlans(false);
      setShowCheckout(false);
    } catch (error) {
      setLoading(false);
      setError(`Payment failed : ${error.message}`);
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div>
        <Modal isOpen={showCheckout}>
          {selectedPlan === "free" ? (
            <Fragment>
              <ModalHeader>
                <p>Cancel your subscription</p>
                <p className="text-sm font-semibold text-gray-400 mt-2">
                  Going back to&nbsp;
                  <span className="capitalize text-indigo-500 font-semibold">
                    {selectedPlan}
                  </span>
                  &nbsp;plan
                </p>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="my-5 rounded bg-red-50 border border-red-300 p-5 text-center text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={onPaymentSubmit}>
                  <p>
                    Are you sure? This will cancel your future subscriptions.
                    The current subscription will be active
                  </p>
                  <div className="flex flex-row gap-4 mt-4">
                    <button
                      type="submit"
                      disabled={!stripe}
                      className="text-sm px-6 py-1 mt-4 text-white focus:outline-none bg-red-500 rounded hover:bg-red-600 transition duration-300"
                    >
                      {loading ? "Cancelling" : "Cancel"}
                    </button>
                    <button
                      className="text-sm px-6 py-1 mt-4 text-white shadow focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                      onClick={toggleCheckout}
                    >
                      Go Back
                    </button>
                  </div>
                </form>
              </ModalBody>
            </Fragment>
          ) : (
            <Fragment>
              <ModalHeader>
                <p>Pay with your card</p>
                <p className="text-sm font-semibold text-gray-400 mt-2">
                  Cancelling to&nbsp;
                  <span className="capitalize text-indigo-500 font-semibold">
                    {selectedPlan}
                  </span>
                  &nbsp;plan
                </p>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="my-5 rounded bg-red-50 border border-red-300 p-5 text-center text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={onPaymentSubmit}>
                  <CardElement options={cardOptions} />
                  <div className="flex flex-row gap-4 mt-4">
                    <button
                      type="submit"
                      disabled={!stripe}
                      className="text-sm px-6 py-1 mt-4 text-white shadow focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                    >
                      {loading ? "Subscribing" : "Subscribe"}
                    </button>
                    <button
                      onClick={toggleCheckout}
                      type="submit"
                      className="text-sm px-6 py-1 mt-4 text-white focus:outline-none bg-red-500 rounded hover:bg-red-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </ModalBody>
            </Fragment>
          )}
        </Modal>
      </div>
      <div className="flex flex-col justify-center items-center mt-20">
        <div className="w-1/2 lg:w-2/4 space-y-3">
          <p className="text-2xl text-center mb-5">Update your plan</p>
          <form onSubmit={handleSubmit(onPlanSubmit)}>
            <div className="flex flex-col">
              <div className="mb-5">
                <p className="text-center">
                  You are currently on a&nbsp;
                  <span className="text-indigo-500 capitalize font-semibold">
                    {user.plan}
                  </span>
                  &nbsp;plan.
                </p>
              </div>
              <div className="flex flex-col p-4 bg-white shadow rounded-lg mb-5">
                <label className="inline-flex items-start">
                  <input
                    type="radio"
                    value="free"
                    {...register("plan")}
                    className="form-radio h-5 w-5 text-gray-600"
                  />
                  <div className="ml-2 text-gray-700 -mt-1">
                    <p className="font-semibold">
                      Free Plan - <span>&#8377;</span> 0&nbsp;
                      <span className="text-xs text-gray-500">(monthly)</span>
                    </p>
                    <p className="text-light text-sm text-gray-500">
                      Cancel the subcription and get 1 Joke.
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex flex-col p-4 bg-white shadow rounded-lg mb-5">
                <label className="inline-flex items-start">
                  <input
                    type="radio"
                    value="basic"
                    {...register("plan")}
                    className="form-radio h-5 w-5 text-gray-600"
                  />
                  <div className="ml-2 text-gray-700 -mt-1">
                    <p className="font-semibold">
                      Basic Plan - <span>&#8377;</span> 100&nbsp;
                      <span className="text-xs text-gray-500">(monthly)</span>
                    </p>
                    <p className="text-light text-sm text-gray-500">
                      Subcribe to the Basic Plan and get 5 Jokes.
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex flex-col p-4 bg-white shadow rounded-lg mb-5">
                <label className="inline-flex items-start">
                  <input
                    type="radio"
                    value="pro"
                    {...register("plan")}
                    className="form-radio h-5 w-5 text-gray-600"
                  />
                  <div className="ml-2 text-gray-700 -mt-1">
                    <p className="font-semibold">
                      Pro Plan - <span>&#8377;</span> 500&nbsp;
                      <span className="text-xs text-gray-500">(monthly)</span>
                    </p>
                    <p className="text-light text-sm text-gray-500">
                      Subcribe to the Pro Plan and get 10 Jokes.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex justify-center items-center flex-row gap-4">
                <button
                  onClick={() => {
                    setShowPlans(true);
                  }}
                  className="text-sm px-6 py-1 mt-4 text-white shadow focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                >
                  Update Plan
                </button>
                <button
                  onClick={() => {
                    setShowPlans(false);
                  }}
                  className="text-sm px-6 py-1 mt-4 text-indigo-500 shadow focus:outline-none border bg-white rounded hover:bg-gray-100 transition duration-300"
                >
                  Go Back
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

function UserContent(props) {
  const { user, content, result, setShowPlans, signOutUser } = props;
  const renderContent = (data) => {
    if (data !== null) {
      return data.map((item) => {
        return (
          <div className="flex flex-col p-4 text-center" key={item.id}>
            <div>
              <p className="text-xl">{item.setup}</p>
            </div>
            <div>
              <p className="text-xl text-indigo-500">{item.punchline}</p>
            </div>
            <div className="mt-2">
              <p className="font-semibold text-sm">
                Type:&nbsp;
                <span className="text-gray-500 capitalize">{item.type}</span>
              </p>
            </div>
          </div>
        );
      });
    }
  };

  return (
    <div>
      {user && content ? (
        <div className="flex flex-col justify-center items-center mt-20">
          <div className="w-1/2 lg:w-2/4">
            <div className="flex flex-col">
              <div className="overflow-hidden sm:rounded-lg mb-5">
                <div className="py-5">
                  <p className="text-2xl font-medium text-gray-900 ">
                    Welcome
                    <span className="text-indigo-500">
                      &nbsp;{user.firstname}&nbsp;{user.lastname}
                    </span>
                    ,
                  </p>
                  <div className="mt-10 text-gray-600  space-y-2">
                    <p>
                      You are registered with&nbsp;
                      <span className="text-indigo-500 font-semibold">
                        {user.email}
                      </span>
                      .
                    </p>
                    <p>
                      You are currently on a&nbsp;
                      <span className="text-indigo-500 capitalize font-semibold">
                        {user.plan}
                      </span>
                      &nbsp;plan.
                    </p>
                    {user.hasTrial && (
                      <p>
                        Your trial period ends on&nbsp;
                        <span className="text-indigo-500 font-semibold">
                          {new Date(user.endDate).toString()}
                        </span>
                      </p>
                    )}
                    {!user.hasTrial && user.endDate && (
                      <p>
                        Your plan ends on&nbsp;
                        <span className="text-indigo-500 font-semibold">
                          {new Date(user.endDate).toString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-5">
                <div className="text-center px-4 py-5 sm:px-6 ">
                  <p className="text-3xl font-bold ">
                    The&nbsp;
                    <span className="text-indigo-500">
                      {user.plan === "free" ? "Joke" : "Jokes"}
                    </span>
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4">
                  {renderContent(content)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <button
              onClick={() => {
                setShowPlans(true);
              }}
              className="text-sm px-6 py-1 mt-4 shadow text-white focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
            >
              Update Plan
            </button>
            <button
              onClick={signOutUser}
              className="text-sm px-6 py-1 mt-4 shadow text-white focus:outline-none bg-red-500 rounded hover:bg-red-600 transition duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-20">
          <div className="w-1/2 lg:w-1/4">
            <Fragment>
              {result && (
                <div className="flex flex-col gap-4 justify-center items-center">
                  <div
                    className="bg-red-100 border-t-4 text-center border-red-500 rounded text-red-900 px-4 py-3 shadow-md"
                    role="alert"
                  >
                    <div className="flex text-center">
                      <div>
                        {result === 401 && (
                          <Fragment>
                            <p className="font-bold">
                              Unauthorised. Could not access user's data
                            </p>
                            <p className="text-sm">Please try again later.</p>
                          </Fragment>
                        )}
                        {result === 404 && (
                          <Fragment>
                            <p className="font-bold">
                              Could not find user's data
                            </p>
                            <p className="text-sm">Please try again later.</p>
                          </Fragment>
                        )}
                        {result === 500 && (
                          <p>
                            There was an error.
                            <br /> Please try again later.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={signOutUser}
                      type="submit"
                      className="text-sm px-6 py-1 mt-4 text-white focus:outline-none bg-red-500 rounded hover:bg-red-600 transition duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </Fragment>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage() {
  const { state, dispatch } = useStoreContext();
  const [result, setResult] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [showInitialPlans, setShowInitialPlans] = useState(true);
  const auth = state.auth;
  const user = state.user;
  const content = state.content;

  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  );

  const signOutUser = () => {
    dispatch({ type: "revokeUser" });
  };

  const getData = async (auth) => {
    const { id, accessToken } = auth;
    try {
      const userResponse = await client.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = userResponse.data;

      if (user) {
        const { plan } = user;
        if (plan !== "none") {
          setShowInitialPlans(false);
        }
      }

      dispatch({ type: "setUser", user });

      const contentResponse = await client.post(
        "/jokes",
        { plan: user.plan },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const content = contentResponse.data;
      dispatch({ type: "setContent", content });
    } catch (error) {
      if (error.message.includes("401", "403")) {
        setResult(401);
      } else if (error.message.includes("404")) {
        setResult(404);
      } else {
        setResult(500);
      }
    }
  };

  useEffect(() => {
    getData(auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, showInitialPlans]);

  return (
    <Elements stripe={stripePromise}>
      {user && (
        <div className="py-4">
          {showInitialPlans ? (
            <InitialPlans
              auth={auth}
              user={user}
              signOutUser={signOutUser}
              setShowInitialPlans={setShowInitialPlans}
            />
          ) : (
            <Fragment>
              {showPlans ? (
                <UserPlans
                  auth={auth}
                  user={user}
                  setShowPlans={setShowPlans}
                />
              ) : (
                <UserContent
                  user={user}
                  result={result}
                  content={content}
                  setShowPlans={setShowPlans}
                  signOutUser={signOutUser}
                />
              )}
            </Fragment>
          )}
        </div>
      )}
    </Elements>
  );
}

export default HomePage;
