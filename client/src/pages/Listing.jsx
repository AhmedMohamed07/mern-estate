import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  FaBath,
  FaBed,
  FaChair,
  FaLocationDot,
  FaShare,
  FaSquareParking,
} from 'react-icons/fa6';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    const fetchListing = async (id) => {
      try {
        setLoading(true);

        const res = await fetch(`/api/listing/get/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setError(false);
        setLoading(false);

        console.log(data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing(id);
  }, [id]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="flex flex-col gap-4 p-3 my-8">
            <h1 className="font-semibold text-2xl">
              {listing.name} - $ {listing.regularPrice} / month
            </h1>

            <p className="flex gap-2 items-center">
              <FaLocationDot className="text-green-700" />
              <span className="text-sm text-gray-700 font-bold">
                {' '}
                {listing.address}{' '}
              </span>
            </p>

            <div className="flex gap-3 text-white">
              <button className="w-full max-w-52 bg-red-900 p-1 rounded-lg">
                For {listing.type}
              </button>
              {listing.discountPrice > 0 && (
                <button className="w-full max-w-52 bg-green-800 p-1 rounded-lg">
                  ${listing.discountPrice} discount
                </button>
              )}
            </div>

            <div>
              <strong>Description - </strong>
              <span>{listing.description}</span>
            </div>

            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaSquareParking className="text-lg" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
