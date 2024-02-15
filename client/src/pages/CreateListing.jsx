import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
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
      setImageUploadError('You can only upload 6 images per listing');
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

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl text-center font-bold my-7">
        Create a Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-10">
        <div className="gap-4 flex flex-col flex-1">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            className="p-3 rounded-lg border"
          />

          <textarea
            type="text"
            name="name"
            id="description"
            placeholder="Description"
            className="p-3 rounded-lg border"
          />

          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            className="p-3 rounded-lg border"
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="sell"
                id="sell"
                className="w-5 h-5 text-blue-600 rounded"
              />
              <label htmlFor="sell">Sell</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="rent"
                id="rent"
                className="w-5 h-5 text-blue-600 rounded"
                defaultChecked
              />
              <label htmlFor="rent">Rent</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5 h-5 text-blue-600 rounded"
              />
              <label htmlFor="parking">Parking spot</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5 h-5 text-blue-600 rounded"
              />
              <label htmlFor="furnished">Furnished</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5 h-5 text-blue-600 rounded"
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
                defaultValue={1}
              />
              <label htmlFor="beds">beds</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                min={0}
                max={10}
                required
                type="number"
                name="baths"
                id="baths"
                className="p-3 rounded-lg border"
                defaultValue={1}
              />
              <label htmlFor="baths">Baths</label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                min={50}
                max={100000}
                required
                type="number"
                name="regular"
                id="regular"
                className="p-3 rounded-lg border"
                defaultValue={0}
              />
              <div className="flex flex-col">
                <label htmlFor="regular">Regular price</label>
                <label htmlFor="regular" className="text-center text-xs">
                  ($ / Month)
                </label>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input
                min={50}
                max={100000}
                required
                type="number"
                name="discounted"
                id="discounted"
                className="p-3 rounded-lg border"
                defaultValue={0}
              />
              <div className="flex flex-col">
                <label htmlFor="discounted">Discounted price</label>
                <label htmlFor="discounted" className="text-center text-xs">
                  ($ / Month)
                </label>
              </div>
            </div>
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
          >
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
}
