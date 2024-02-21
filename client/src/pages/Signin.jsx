import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const Signin = () => {
  const [formData, setformData] = useState({});
  // const [isError, setIsError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const changeHandler = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
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
          disabled={loading}
          type="submit"
          className="bg-blue-950 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>

      <p className="mt-5">
        Don't have an account?
        <Link to="/sign-up" className="text-blue-600 font-bold">
          {' '}
          Sign up
        </Link>
      </p>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Signin;
