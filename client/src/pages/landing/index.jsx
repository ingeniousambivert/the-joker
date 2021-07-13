import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="mt-20">
          <p className="text-3xl font-bold">
            The <span className="text-indigo-500">Joker</span>
          </p>
        </div>
        <div className="mt-2">
          <p className="font-light text-gray-600">
            Jokes everywhere. Jokes everyday
          </p>
        </div>
        <div className="mt-20 px-40">
          <p className="font-semibold text-gray-800 text-xl">
            Why jokes? Why humor?
          </p>
          <p className="text-gray-600">
            There are many theories of humor which attempt to explain what humor
            is, what social functions it serves, and what would be considered
            humorous. Among the prevailing types of theories that attempt to
            account for the existence of humor, there are psychological
            theories, the vast majority of which consider humor to be very
            healthy behavior; there are spiritual theories, which consider humor
            to be an inexplicable mystery, very much like a mystical experience.
            Although various classical theories of humor and laughter may be
            found, in contemporary academic literature, three theories of humor
            appear repeatedly: relief theory, superiority theory, and
            incongruity theory. Among current humor researchers, there is no
            consensus about which of these three theories of humor is most
            viable. Proponents of each one originally claimed their theory to be
            capable of explaining all cases of humor. However, they now
            acknowledge that although each theory generally covers its own area
            of focus, many instances of humor can be explained by more than one
            theory. Similarly, one view holds that theories have a combinative
            effect; Jeroen Vandaele claims that incongruity and superiority
            theories describe complementary mechanisms which together create
            humor.
          </p>
          <div className="mt-10 flex flex-row gap-4 text-white">
            <div>
              <Link to="/signin">
                <button
                  type="submit"
                  className="px-6 py-1.5 mt-4 text-white focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                >
                  Sign In
                </button>
              </Link>
            </div>
            <div>
              <Link to="/signup">
                <button
                  type="submit"
                  className="px-6 py-1.5 mt-4 text-white focus:outline-none bg-indigo-500 rounded hover:bg-indigo-600 transition duration-300"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
