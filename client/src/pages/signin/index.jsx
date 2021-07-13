import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import client from "../../utils/client";
import useStoreContext from "../../store";

function SigninPage() {
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
      const response = await client.post("/auth/signin", data);
      const auth = response.data;
      dispatch({ type: "authenticateUser", auth });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.message.includes(401)) {
        setResult(401);
      } else {
        setResult(500);
      }
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
                  {result === 401 && (
                    <Fragment>
                      <p className="font-bold">Could not sign in</p>
                      <p className="text-sm">
                        Your email or password is incorrect.
                      </p>
                    </Fragment>
                  )}
                  {result === 500 && (
                    <p>
                      There was an error while signing in your account.
                      <br /> Please try again later.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Fragment>
        <p className="text-3xl font-semibold">Sign In</p>
        <p className="text-gray-400 font-light mb-5">
          Signin to your account to read The Jokes
        </p>
        <div className="w-1/2 lg:w-1/4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
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
                  {loading === true ? "Signing In..." : "Sign In"}
                </button>
              </div>
              <div className="pt-5">
                <p className="text-sm">
                  Don&apos;t have an account ?&nbsp;
                  <Link
                    to="/signup"
                    className="underline hover:text-indigo-600"
                  >
                    Sign Up
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

export default SigninPage;
