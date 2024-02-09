import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center text-3xl my-7 font-semibold">Profile</h1>

      <form className="flex flex-col gap-4">
        <img
          src={
            currentUser.avatar ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          }
          alt="profile"
          className="self-center rounded-full w-24 h-24 cursor-pointer object-cover"
        />

        <p className="text-sm self-center">
          <span className="text-green-800">Image uploaded successfully</span>
        </p>

        <input
          type="text"
          placeholder="Username"
          className="p-3 rounded-lg"
          value={currentUser.username}
        />

        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-3 rounded-lg border"
          value={currentUser.email}
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
