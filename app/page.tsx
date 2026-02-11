"use client";
import { useEffect, useState } from 'react';

// Define the shape of our data
interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  user: { username: string };
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace with your Render Backend URL later
  // For local testing use: http://localhost:3000
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; 

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
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-indigo-600 mb-8">UniMarket</h1>
      
      {loading ? (
        <p>Loading market...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  ${item.price}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
              <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                Seller: @{item.user?.username}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}