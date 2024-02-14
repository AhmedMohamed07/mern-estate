import React from 'react';

const CreateListing = () => {
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
                checked
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
                value={1}
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
                value={1}
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
                value={1}
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
                value={1}
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
          <p class="font-semibold">
            Images:{' '}
            <span class="text-gray-600 font-normal">
              The first image will be the cover (max 6)
            </span>
          </p>

          <form className="flex  gap-4 items-center">
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              multiple
              className="p-3 border flex-1"
            />
            <button
              type="submit"
              className="p-3 text-green-700 border  border-green-700 hover:shadow-lg rounded bold disabled:opacity-50"
            >
              UPLOAD
            </button>
          </form>
          <p class="text-red-700">
            Total number of images must be less than 7 and at least 1 image must
            be selected
          </p>

          <button
            type="submit"
            className="bg-blue-950 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
          >
            {'Loading  Update'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
