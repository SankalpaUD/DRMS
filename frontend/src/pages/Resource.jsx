import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaShare,
} from 'react-icons/fa';

export default function Resource() {
  SwiperCore.use([Navigation]);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const defaultImageUrl =
    'https://st2.depositphotos.com/3092723/5368/i/450/depositphotos_53689175-stock-photo-home-for-rent.jpg';

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/resource/get/${params.resourceId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setResource(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchResource();
  }, [params.resourceId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {resource && !loading && !error && (
        <div>
          <Swiper navigation>
            {(resource.imageUrl && resource.imageUrl.length > 0
              ? resource.imageUrl
              : [defaultImageUrl]
            ).map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[450px] rounded-lg shadow-md"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share button */}
          <div className="fixed top-[13%] right-[3%] z-10 shadow-md border rounded-full w-12 h-12 flex justify-center items-center bg-white cursor-pointer hover:shadow-lg transition duration-300">
            <FaShare
              className="text-gray-500 hover:text-gray-700"
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
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 shadow-lg">
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-5 my-5 gap-4 bg-white shadow-xl rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span
                  className={`text-lg font-semibold ${
                    resource.availability ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {resource.availability ? 'Available' : 'Not Available!!!'}
                </span>
                <p className="text-2xl font-semibold mt-1">
                  {resource.name}
                </p>
                <p className="text-xl font-semibold mt-1">
                  Type: {resource.type}
                </p>
              </div>
              {currentUser &&
                resource.userRef !== currentUser._id &&
                resource.availability && (
                  <button
                    onClick={() =>
                      navigate('/checkout', {
                        state: {
                          userId: currentUser._id,
                          resourceId: resource._id,
                          resourceUserId: resource.userRef,
                          resourceName: resource.name,
                          image: resource.imageUrl[0],
                          price: resource.price,
                          discountPrice: resource.discountPrice,
                        },
                      })
                    }
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg uppercase font-semibold hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 p-3"
                  >
                    Book Now
                  </button>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-700">
              <span className="font-semibold text-black">Description: </span>
              {resource.description}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}