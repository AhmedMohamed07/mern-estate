import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
  const [formData, setformData] = useState({});
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setIsLoading(false);
        setIsError(data.message);
        return;
      }
      setIsLoading(false);
      setIsError(null);
      navigate('/');
    } catch (error) {
      setIsError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>

      <form onSubmit={submitHandler} className="flex flex-col gap-4 ">
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-3 rounded-lg border"
          onChange={changeHandler}
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="p-3 rounded-lg border"
          onChange={changeHandler}
        />

        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-950 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-5">
        Don't have an account?
        <Link to="/sign-up" className="text-blue-600 font-bold">
          {' '}
          Sign up
        </Link>
      </p>
      {isError && <p className="text-red-500 mt-5">{isError}</p>}
    </div>
  );
};

export default Signin;
