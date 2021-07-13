import React, { useState, useEffect, Fragment } from "react";
import client from "../../utils/client";
import useStoreContext from "../../store";

function HomePage() {
  const { state, dispatch } = useStoreContext();
  const [result, setResult] = useState(null);
  const auth = state.auth;
  const user = state.user;

  const signOutUser = () => {
    dispatch({ type: "revokeUser" });
  };

  useEffect(() => {
    let isMounted = true;
    const getUserData = async (auth) => {
      const { id, accessToken } = auth;
      try {
        const response = await client.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = response.data;
        if (!isMounted) return;
        dispatch({ type: "setUser", user });
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

    getUserData(auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      isMounted = false;
    };
  }, [auth]);

  return (
    <div>
      <div>
        {user ? (
          <div className="flex flex-col justify-center items-center mt-20">
            <div className="w-1/2 lg:w-2/4">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-5">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                    Welcome
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 border-b border-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Name :&nbsp;
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user.firstname}&nbsp;{user.lastname}
                      </dd>
                    </div>
                    <div className="bg-gray-50 border-b border-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Email :&nbsp;
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user.email}
                      </dd>
                    </div>
                    <div className="bg-gray-50 border-b border-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Email Verified :&nbsp;
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user.isVerified ? "Yes" : "No"}
                      </dd>
                    </div>
                    <div className="bg-gray-50  px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Created At :&nbsp;
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {new Date(user.createdAt).toString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={signOutUser}
                type="submit"
                className="text-sm px-6 py-1 mt-4 text-white focus:outline-none bg-red-700 rounded hover:bg-red-600 transition duration-300"
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
                                Could not access user's data
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
                              There was an error while creating your account.
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
                        className="text-sm px-6 py-1 mt-4 text-white focus:outline-none bg-red-700 rounded hover:bg-red-600 transition duration-300"
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
    </div>
  );
}

export default HomePage;
