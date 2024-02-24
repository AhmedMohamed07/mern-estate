import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Search = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sell'
    ) {
      setSidebardata({
        ...sidebardata,
        type: e.target.id,
      });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'offer' ||
      e.target.id === 'parking' ||
      e.target.id === 'furnished'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({
        ...sidebardata,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('order', sidebardata.order);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('type', sidebardata.type);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="border-b-2 md:border-r-2 md:min-h-screen p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 ">
          <div className="flex items-center gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <input
              type="search"
              placeholder="Search..."
              id="searchTerm"
              name="searchTerm"
              className="p-3 rounded-lg flex-1 w-full"
              onChange={handleChange}
              value={sidebardata.searchTerm}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <p className="font-semibold">Type:</p>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="all"
                id="all"
                className="w-5 h-5 text-blue-600 rounded"
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
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
                checked={sidebardata.type === 'rent'}
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
                checked={sidebardata.type === 'sell'}
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
                checked={sidebardata.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <p className="font-semibold">Amenities:</p>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5 h-5 text-blue-600 rounded"
                onChange={handleChange}
                checked={sidebardata.parking}
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
                checked={sidebardata.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
          </div>

          <div className="flex items-center gap-2 ">
            <p className="font-semibold">Sort:</p>
            <select
              name="sort"
              id="sort_order"
              className=" p-3 rounded-lg"
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-blue-950 text-white p-3 rounded-lg uppercase hover:opacity-85">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="p-3 m-5 text-3xl text-blue-950 border-b-2 font-semibold">
          Listing results:
        </h1>
        <div className="p-7 flex-wrap flex gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-blue-950">No listing found!</p>
          )}

          {loading && (
            <p className="text-xl text-blue-950 text-center">Loading...</p>
          )}

          {!loading &&
            listings.length > 0 &&
            listings.map((list) => <ListingItem key={list._id} list={list} />)}
        </div>
      </div>
    </div>
  );
};

export default Search;
