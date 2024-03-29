import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserstart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../redux/user/userSlice';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const deleteHandler = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(error.message));
      }

      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserstart());
      const res = await fetch('api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(error.message));
      }

      dispatch(signOutUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);

      const data = await res.json();

      if (data.success === false || data.length === 0) {
        setShowListingError(true);
      } else {
        setShowListingError(false);
      }

      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listID) => {
    try {
      const res = await fetch(`/api/listing/delete/${listID}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((list) => list._id !== listID));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center text-3xl my-7 font-semibold">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input
          onChange={handleChange}
          type="text"
          id="username"
          placeholder="Username"
          className="p-3 rounded-lg"
          defaultValue={currentUser.username}
        />

        <input
          onChange={handleChange}
          type="email"
          id="email"
          placeholder="Email"
          className="p-3 rounded-lg border"
          defaultValue={currentUser.email}
        />

        <input
          onChange={handleChange}
          type="password"
          id="password"
          placeholder="Password"
          autoComplete="on"
          className="p-3 rounded-lg border"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-950 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
        >
          {loading ? 'Loading' : 'Update'}
        </button>

        <Link to={'/create-listing'}>
          <button
            type="submit"
            className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70 w-full"
          >
            Create listing
          </button>
        </Link>
      </form>

      <p className="text-red-700 mt-5">{!loading && error}</p>
      <p className="text-green-700 my-5">
        {updateSuccess && 'User is updated successfully!'}
      </p>

      <div className="flex justify-between my-5">
        <button
          type="button"
          className="text-red-600 p-3 bg-transparent border border-red-900 rounded-lg  uppercase hover:shadow-lg disabled:opacity-70"
          onClick={deleteHandler}
        >
          Delete Account
        </button>
        <button
          type="button"
          className="text-red-600 p-3 bg-transparent border border-red-900 rounded-lg  uppercase hover:shadow-lg disabled:opacity-70"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      <button
        onClick={handleShowListing}
        className="text-emerald-600 p-3 bg-transparent border border-emerald-900 rounded-lg  uppercase hover:shadow-lg disabled:opacity-70 self-center block m-auto"
      >
        Show Listings
      </button>
      <p className="text-red-600 text-center my-5">
        {' '}
        {showListingError ? "'You didn't create listings yet!" : ''}
      </p>

      {userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-center font-bold my-7">Your listings</h1>
          {userListings.map((list) => (
            <div
              key={list._id}
              className="border rounded-lg  flex justify-between p-3"
            >
              <div className="flex gap-2 items-center">
                <Link to={`/listing/${list._id}`}>
                  <img
                    src={list.imageUrls[0]}
                    className="w-16 h-16 hover:shadow object-cover"
                    alt="image"
                  />
                </Link>

                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1 hover:shadow"
                  to={`/listing/${list._id}`}
                >
                  {' '}
                  <p>{list.name}</p>
                </Link>
              </div>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleDeleteListing(list._id)}
                  className="text-red-700 uppercase hover:shadow"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${list._id}`}>
                  <button className="text-green-700 uppercase hover:shadow">
                    Edit
                  </button>{' '}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
