"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateListing() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('listing[title]', title);
    formData.append('listing[description]', desc);
    formData.append('listing[price]', price);
    if (image) {
      formData.append('listing[image]', image);
    }

    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        body: formData, // Browser automatically sets Content-Type to multipart/form-data
      });

      if (res.ok) {
        router.push('/'); // Redirect to home on success
      } else {
        alert("Failed to create listing");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Sell an Item</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input required type="text" className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input required type="number" className="w-full border p-2 rounded" value={price} onChange={e => setPrice(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea required className="w-full border p-2 rounded h-24" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full" />
        </div>

        <button 
          disabled={uploading}
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}