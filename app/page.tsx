"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string | null; // Added for S3 support
  user: { username: string };
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Using the live Render Backend URL verified in your logs
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/listings`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch listings:", err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header with Sell Item Action */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
              UniMarket
            </h1>
            <p className="text-gray-500 mt-1">ASU's Student Marketplace</p>
          </div>
          <Link 
            href="/create" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg active:scale-95"
          >
            + Sell an Item
          </Link>
        </header>
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mb-4"></div>
            <p className="text-gray-500 animate-pulse">Fetching latest listings... (might take a few seconds)</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
              <Link 
                href={`/listings/${item.id}`} 
                key={item.id} 
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Image Section - Displays S3 content */}
                <div className="h-52 w-full bg-gray-200 relative overflow-hidden">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-indigo-700 font-bold px-3 py-1 rounded-full shadow-sm text-sm">
                      ${item.price}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center pt-4 border-t border-gray-50">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs mr-2">
                      {item.user?.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-500">
                      Listed by <span className="font-semibold">@{item.user?.username}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No listings yet. Be the first to sell something!</p>
          </div>
        )}
      </div>
    </main>
  );
}