"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string | null;
  user: { username: string };
}

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/listings/${id}`)
        .then((res) => res.json())
        .then((data) => setListing(data));
    }
  }, [id, API_URL]);

  if (!listing) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <Link href="/" className="inline-block m-6 text-indigo-600 hover:underline">← Back to Market</Link>
        
        {listing.image_url && (
          <div className="w-full h-96 bg-gray-200 relative">
             {/* Use standard img for prototype simplicity, or Next/Image for optimization */}
            <img 
              src={listing.image_url} 
              alt={listing.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
            <span className="text-2xl font-bold text-green-600">${listing.price}</span>
          </div>
          <p className="mt-4 text-gray-700 text-lg leading-relaxed">{listing.description}</p>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center">
             <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                {listing.user.username.charAt(0).toUpperCase()}
             </div>
             <div>
               <p className="text-sm text-gray-500">Listed by</p>
               <p className="font-semibold text-gray-900">@{listing.user.username}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}