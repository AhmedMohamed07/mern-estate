import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>

      <form className="flex flex-col gap-4 ">
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="p-3 rounded-lg border"
        />

        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-3 rounded-lg border"
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="p-3 rounded-lg border"
        />

        <button
          type="submit"
          className="bg-blue-950 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
        >
          Sign up
        </button>
      </form>

      <p className="mt-5">
        Have an account?
        <Link to="/sign-in" className="text-blue-600 font-bold">
          {' '}
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
