import React from 'react';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function ListingItem({ list }) {
  return (
    <div className="flex flex-col rounded-lg shadow-sm hover:shadow-lg overflow-hidden w-full sm:w-[330px] bg-white transition-shadow duration-300">
      <Link to={`/listing/${list._id}`}>
        {' '}
        <img
          src={
            list.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt="list image"
          className="h-[320px] sm:h-[220px] w-full hover:scale-105 object-cover duration-300"
        />
        <div className="flex flex-col p-4 gap-2">
          <h1 className="truncate text-lg font-semibold ">{list.name}</h1>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {list.address}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {list.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold ">
            $
            {list.offer
              ? list.discountPrice.toLocaleString('en-US')
              : list.regularPrice.toLocaleString('en-US')}
            {list.type === 'rent' && ' / month'}
          </p>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {list.bedrooms > 1
                ? `${list.bedrooms} beds `
                : `${list.bedrooms} bed `}
            </div>
            <div className="font-bold text-xs">
              {list.bathrooms > 1
                ? `${list.bathrooms} baths `
                : `${list.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
