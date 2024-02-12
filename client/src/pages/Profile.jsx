import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center text-3xl my-7 font-semibold">Profile</h1>

      <form className="flex flex-col gap-4">
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
          type="text"
          placeholder="Username"
          className="p-3 rounded-lg"
          defaultValue={currentUser.username}
        />

        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-3 rounded-lg border"
          defaultValue={currentUser.email}
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          autoComplete="on"
          className="p-3 rounded-lg border"
        />

        <button
          type="submit"
          className="bg-blue-950 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
        >
          {'Update'}
        </button>

        <Link to={'create-listing'}>
          <button
            type="submit"
            className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70 w-full"
          >
            {'create listing'}
          </button>
        </Link>
      </form>

      <p className="text-red-700 mt-5">{''}</p>
      <p className="text-green-700 my-5">{'User is updated successfully!'}</p>
      <button className="bg-emerald-800 w-full p-3  text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-70">
        Show Listings
      </button>

      <div className="flex justify-between mt-5">
        <button
          type="button"
          className="bg-red-700 p-3 text-white rounded-lg  uppercase hover:opacity-90 disabled:opacity-70"
        >
          Delete Account
        </button>
        <button
          type="button"
          className="bg-red-700 p-3 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
