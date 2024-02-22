import React, { useState } from 'react';

const Search = () => {
  const [formData, setFormData] = useState(null);
  const handleChange = (e) => {};

  return (
    <div className="flex flex-col sm:flex-row p-7 gap-10">
      <form className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <label htmlFor="searchTerm" className="whitespace-nowrap">
            Search Term:
          </label>
          <input
            type="text"
            placeholder="Search..."
            id="searchTerm"
            name="searchTerm"
            className="p-3 rounded-lg flex-1"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <p>Type:</p>
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="rentNsale"
              id="rentNsale"
              className="w-5 h-5 text-blue-600 rounded"
              onChange={handleChange}
              // checked={formData.type === 'rentNsale'}
            />
            <label htmlFor="rentNsale">Rent & Sell</label>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="rent"
              id="rent"
              className="w-5 h-5 text-blue-600 rounded"
              onChange={handleChange}
              // checked={formData.type === 'rent'}
            />
            <label htmlFor="rent">Rent</label>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="sell"
              id="sell"
              className="w-5 h-5 text-blue-600 rounded"
              onChange={handleChange}
              // checked={formData.type === 'sell'}
            />
            <label htmlFor="sell">Sell</label>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="offer"
              id="offer"
              className="w-5 h-5 text-blue-600 rounded"
              onChange={handleChange}
              // checked={formData.offer}
            />
            <label htmlFor="offer">Offer</label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <p>Amenities:</p>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="parking"
              id="parking"
              className="w-5 h-5 text-blue-600 rounded"
              onChange={handleChange}
              // checked={formData.parking}
            />
            <label htmlFor="parking">Parking</label>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="furnished"
              id="furnished"
              className="w-5 h-5 text-blue-600 rounded"
              onChange={handleChange}
              // checked={formData.furnished}
            />
            <label htmlFor="furnished">Furnished</label>
          </div>
        </div>

        <div className="flex items-center gap-2 ">
          <p>Sort:</p>
          <select name="sort" id="sort" className=" p-3 rounded-lg">
            <option value="htl">Price high to low</option>
            <option value="lth">Price low to high</option>
            <option value="lateset">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </form>
      <div className="">
        <h2>Listing results:</h2>
      </div>
    </div>
  );
};

export default Search;
