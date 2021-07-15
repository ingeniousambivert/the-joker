import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import client from "../../utils/client";
import useStoreContext from "../../store";

function SignupPage() {
  const { dispatch } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await client.post("/auth/signup", data);
      setLoading(false);
      const auth = response.data;
      dispatch({ type: "authenticateUser", auth });
    } catch (error) {
      if (error.message.includes(409)) {
        setResult(409);
      } else {
        setResult(500);
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mt-10 flex flex-col justify-center items-center gap-4">
        <Fragment>
          {result && (
            <div
              className="bg-red-100 border-t-4 border-red-500 rounded text-red-900 px-4 py-3 shadow-md"
              role="alert"
            >
              <div className="flex text-center">
                <div>
                  {result === 409 && (
                    <Fragment>
                      <p className="font-bold">Could not create account</p>
                      <p className="text-sm">
                        This email is already in use please use another
                      </p>
                    </Fragment>
                  )}
                  {result === 500 && (
                    <p>
                      There was an error while creating your account.
                      <br /> Please try again later.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Fragment>
        <p className="text-3xl font-semibold">Sign Up</p>
        <p className="text-gray-400 font-light mb-5">
          Create an account to read The Jokes
        </p>
        <div className="w-1/2 lg:w-1/4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div>
                  <input
                    {...register("firstname", { required: true })}
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter First Name"
                  />
                  {errors.firstname && (
                    <small className="text-red-400 font-light">
                      This field is required
                    </small>
                  )}
                </div>
                <div>
                  <input
                    {...register("lastname", { required: true })}
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter Last Name"
                  />
                  {errors.lastname && (
                    <small className="text-red-400 font-light">
                      This field is required
                    </small>
                  )}
                </div>
              </div>
              <div>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  id="email"
                  name="email"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <small className="text-red-400 font-light">
                    This field is required
                  </small>
                )}
              </div>
              <div>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  id="password"
                  name="password"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter Password"
                />
                {errors.password && (
                  <small className="text-red-400 font-light">
                    This field is required
                  </small>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="px-6 py-1.5 mt-4 text-white focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                >
                  {loading === true ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
              <div className="pt-5">
                <p className="text-sm">
                  Already have an account ?&nbsp;
                  <Link
                    to="/signin"
                    className="underline hover:text-indigo-600"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
