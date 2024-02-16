import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('Minimum 1 image , maximum 6');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sell' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
      console.log(e.target.id);
    }

    if (
      e.target.id === 'offer' ||
      e.target.id === 'parking' ||
      e.target.id === 'furnished'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'text' ||
      e.target.type === 'textarea' ||
      e.target.type === 'number'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  console.log(formData);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setIsError('You must upload at least one image');
        return;
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        setIsError('Discount price must be lower than regular price');
        return;
      }
      setLoading(true);
      setIsError(null);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + 'access_token',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      console.log(currentUser._id);

      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setIsError(data.message);
        setLoading(false);
        return;
      }

      navigate(`/listing/${data._id}`);
      setLoading(false);
    } catch (error) {
      setIsError(data.message);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl text-center font-bold my-7">
        Create a Listing
      </h1>

      <form
        onSubmit={submitHandler}
        className="flex flex-col sm:flex-row gap-10"
      >
        <div className="gap-4 flex flex-col flex-1">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            required
            className="p-3 rounded-lg border"
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            name="name"
            id="description"
            placeholder="Description"
            className="p-3 rounded-lg border"
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            required
            className="p-3 rounded-lg border"
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="sell"
                id="sell"
                className="w-5 h-5 text-blue-600 rounded"
                onChange={handleChange}
                checked={formData.type === 'sell'}
              />
              <label htmlFor="sell">Sell</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="rent"
                id="rent"
                className="w-5 h-5 text-blue-600 rounded"
                required
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <label htmlFor="rent">Rent</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5 h-5 text-blue-600 rounded"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor="parking">Parking spot</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5 h-5 text-blue-600 rounded"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5 h-5 text-blue-600 rounded"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                min={0}
                max={10}
                required
                type="number"
                name="beds"
                id="beds"
                className="p-3 rounded-lg border"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="beds">beds</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                min={0}
                max={10}
                required
                type="number"
                name="bathrooms"
                id="bathrooms"
                className="p-3 rounded-lg border"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                min={50}
                max={100000}
                required
                type="number"
                name="regularPrice"
                id="regularPrice"
                className="p-3 rounded-lg border"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col">
                <label htmlFor="regularPrice">Regular price</label>
                <label htmlFor="regularPrice" className="text-center text-xs">
                  ($ / Month)
                </label>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  min={50}
                  max={100000}
                  required
                  type="number"
                  name="discountPrice"
                  id="discountPrice"
                  className="p-3 rounded-lg border"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col">
                  <label htmlFor="discountPrice">Discounted price</label>
                  <label
                    htmlFor="discountPrice"
                    className="text-center text-xs"
                  >
                    ($ / Month)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{' '}
            <span className="text-gray-600 font-normal">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex  gap-4 ">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              name="image"
              id="image"
              accept="image/*"
              multiple
              className="p-3 border flex-1"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border uppercase border-green-700 hover:shadow-lg rounded bold disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            type="submit"
            className="bg-blue-950 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
            disabled={loading || uploading}
          >
            {loading ? 'Creating' : 'Create listing'}
          </button>
          <p className="text-red-700">{isError}</p>
        </div>
      </form>
    </main>
  );
}
