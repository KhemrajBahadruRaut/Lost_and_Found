'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, MapPin, Calendar, Tag, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface User {
  name: string;
  email: string;
  phone?: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl?: string;
  user: User;
}

interface Match {
  _id: string;
  lostPost: Post;
  foundPost: Post;
  matchScore: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/matches/matches.php', {
        credentials: 'include', 
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('You are not logged in. Please login to see matches.');
        } else {
          setError('Failed to fetch matches. Try again later.');
        }
        return;
      }

      const data: Match[] = await response.json();
      setMatches(data);
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchAction = async (matchId: string, action: 'confirmed' | 'rejected') => {
    try {
      const response = await fetch(`http://localhost/lost_and_found_backend/matches/match_update.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, status: action }),
      });

      if (response.ok) {
        setMatches(matches.map(match =>
          match._id === matchId ? { ...match, status: action } : match
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMatches = matches.filter(match =>
    filter === 'all' || match.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Potential Matches</h1>
          <p className="text-gray-600">Review items that might match your posts</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {(['all','pending','confirmed','rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === f
                  ? f === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : f === 'confirmed'
                    ? 'bg-green-600 text-white'
                    : f === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({matches.filter(m => f==='all' ? true : m.status===f).length})
            </button>
          ))}
        </div>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No matches found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map(match => (
              
              <div key={match._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-blue-600">Match Score: {match.matchScore}%</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      match.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(match.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Lost Item */}
                  <div className="border-r pr-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-3">Lost Item</h3>
                    {match.lostPost.imageUrl && <img src={match.lostPost.imageUrl} alt={match.lostPost.title} className="w-full h-48 object-cover rounded-lg mb-3"/>}
                    <h4 className="font-semibold text-gray-900 mb-2">{match.lostPost.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{match.lostPost.description}</p>
                    

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2"><Tag size={16} />{match.lostPost.category}</div>
                      <div className="flex items-center gap-2"><MapPin size={16} />{match.lostPost.location}</div>
                      <div className="flex items-center gap-2"><Calendar size={16} />{new Date(match.lostPost.date).toLocaleDateString()}</div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-1">Contact Information:</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} /><a href={`mailto:${match.lostPost.user.email}`} className="hover:text-blue-600">{match.lostPost.user.email}</a>
                      </div>
                      {match.lostPost.user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />{match.lostPost.user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  

                  {/* Found Item */}
                  <div className="pl-6">
                    <h3 className="text-lg font-semibold text-green-600 mb-3">Found Item</h3>
                    {match.foundPost.imageUrl && <img src={match.foundPost.imageUrl} alt={match.foundPost.title} className="w-full h-48 object-cover rounded-lg mb-3"/>}
                    <h4 className="font-semibold text-gray-900 mb-2">{match.foundPost.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{match.foundPost.description}</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2"><Tag size={16} />{match.foundPost.category}</div>
                      <div className="flex items-center gap-2"><MapPin size={16} />{match.foundPost.location}</div>
                      <div className="flex items-center gap-2"><Calendar size={16} />{new Date(match.foundPost.date).toLocaleDateString()}</div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-1">Contact Information:</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} /><a href={`mailto:${match.foundPost.user.email}`} className="hover:text-blue-600">{match.foundPost.user.email}</a>
                      </div>
                      {match.foundPost.user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />{match.foundPost.user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {match.status === 'pending' && (
                  <div className="mt-6 flex gap-4 justify-center">
                    <button onClick={() => handleMatchAction(match._id, 'confirmed')} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                      <CheckCircle size={20}/> Confirm Match
                    </button>
                    <button onClick={() => handleMatchAction(match._id, 'rejected')} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                      <XCircle size={20}/> Not a Match
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}