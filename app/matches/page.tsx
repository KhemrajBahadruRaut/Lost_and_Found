'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, MapPin, Calendar, Tag, Mail, Phone, Clock, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LostUserConfirmationModal, { LostUserConfirmationData } from '@/components/matches/LostUserConfirmationModal';
import FoundUserConfirmationModal, { FoundUserConfirmationData } from '@/components/matches/FoundUserConfirmationModal';
import ImageGallery from '@/components/ui/ImageGallery';
import toast from 'react-hot-toast';

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
  images?: string[];
  user: User;
  userId?: number;
}

interface Match {
  _id: string;
  lostPost: Post;
  foundPost: Post;
  matchScore: number;
  status: 'matched' | 'pending' | 'admin_review' | 'confirmed' | 'rejected' | '';
  currentUserRole: 'lost' | 'found' | 'none';
  lostUserConfirmed: boolean;
  foundUserConfirmed: boolean;
  createdAt: string;
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'admin_review' | 'confirmed' | 'rejected'>('all');
  
  // Modal states
  const [showLostModal, setShowLostModal] = useState(false);
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleConfirmClick = (match: Match) => {
    setSelectedMatch(match);
    
    // Determine which modal to show based on user role
    if (match.currentUserRole === 'lost') {
      // Check if already confirmed
      if (match.lostUserConfirmed) {
        toast.error('You have already submitted your confirmation');
        return;
      }
      setShowLostModal(true);
    } else if (match.currentUserRole === 'found') {
      // Check if already confirmed
      if (match.foundUserConfirmed) {
        toast.error('You have already submitted your confirmation');
        return;
      }
      setShowFoundModal(true);
    } else {
      toast.error('You are not authorized to confirm this match');
    }
  };

  const handleLostUserSubmit = async (data: LostUserConfirmationData) => {
    if (!selectedMatch) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/matches/submit_confirmation.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatch._id,
          userType: 'lost',
          confirmationData: data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message);
        setShowLostModal(false);
        setSelectedMatch(null);
        // Refresh matches
        fetchMatches();
      } else {
        toast.error(result.message || 'Failed to submit confirmation');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFoundUserSubmit = async (data: FoundUserConfirmationData) => {
    if (!selectedMatch) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/matches/submit_confirmation.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatch._id,
          userType: 'found',
          confirmationData: data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message);
        setShowFoundModal(false);
        setSelectedMatch(null);
        // Refresh matches
        fetchMatches();
      } else {
        toast.error(result.message || 'Failed to submit confirmation');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    if (!confirm('Are you sure this is not a match?')) return;

    try {
      const response = await fetch('http://localhost/lost_and_found_backend/matches/match_update.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, status: 'rejected' }),
      });

      if (response.ok) {
        setMatches(matches.map(match =>
          match._id === matchId ? { ...match, status: 'rejected' } : match
        ));
        toast.success('Match rejected');
      } else {
        toast.error('Failed to update match status');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  };

  const getStatusBadge = (match: Match) => {
    const { status, lostUserConfirmed, foundUserConfirmed, currentUserRole } = match;
    
    if (status === 'confirmed') {
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' };
    }
    if (status === 'rejected') {
      return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
    }
    if (status === 'admin_review') {
      return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Under Review' };
    }
    if (status === 'pending') {
      // Show which user has confirmed
      if (lostUserConfirmed && !foundUserConfirmed) {
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Waiting for Finder' };
      }
      if (!lostUserConfirmed && foundUserConfirmed) {
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Waiting for Owner' };
      }
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' };
    }
    return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Potential Match' };
  };

  const canConfirm = (match: Match) => {
    // Can only confirm if match is in 'matched' or 'pending' status
    if (!['matched', 'pending', ''].includes(match.status)) return false;
    
    // Check if current user has already confirmed
    if (match.currentUserRole === 'lost' && match.lostUserConfirmed) return false;
    if (match.currentUserRole === 'found' && match.foundUserConfirmed) return false;
    
    return match.currentUserRole !== 'none';
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'admin_review') return match.status === 'admin_review';
    return match.status === filter;
  });

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
          <p className="text-gray-600">Review items that might match your posts and confirm ownership</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {(['all', 'pending', 'admin_review', 'confirmed', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === f
                  ? f === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : f === 'admin_review'
                    ? 'bg-purple-600 text-white'
                    : f === 'confirmed'
                    ? 'bg-green-600 text-white'
                    : f === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              {f === 'admin_review' ? 'Under Review' : f.charAt(0).toUpperCase() + f.slice(1)} 
              ({matches.filter(m => f === 'all' ? true : f === 'admin_review' ? m.status === 'admin_review' : m.status === f).length})
            </button>
          ))}
        </div>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No matches found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map(match => {
              const statusBadge = getStatusBadge(match);
              
              return (
                <div key={match._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-blue-600">Match Score: {match.matchScore}%</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                      {/* Show role badge */}
                      {match.currentUserRole !== 'none' && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          match.currentUserRole === 'lost' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {match.currentUserRole === 'lost' ? 'Your Lost Item' : 'You Found This'}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{new Date(match.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Confirmation Progress */}
                  {['matched', 'pending', 'admin_review'].includes(match.status) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Users size={16} />
                        <span className="font-medium">Confirmation Progress:</span>
                      </div>
                      <div className="flex gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded ${
                          match.lostUserConfirmed ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${match.lostUserConfirmed ? 'bg-green-500' : 'bg-gray-400'}`} />
                          Lost Owner: {match.lostUserConfirmed ? 'Confirmed' : 'Pending'}
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded ${
                          match.foundUserConfirmed ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${match.foundUserConfirmed ? 'bg-green-500' : 'bg-gray-400'}`} />
                          Finder: {match.foundUserConfirmed ? 'Confirmed' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Lost Item */}
                    <div className="border-r pr-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-3">Lost Item</h3>
                      {(match.lostPost.images && match.lostPost.images.length > 0) ? (
                        <ImageGallery images={match.lostPost.images} alt={match.lostPost.title} />
                      ) : match.lostPost.imageUrl && (
                        <img src={match.lostPost.imageUrl} alt={match.lostPost.title} className="w-full h-64 object-contain rounded-lg mb-3"/>
                      )}
                      <h4 className="font-semibold text-gray-900 mb-2">{match.lostPost.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{match.lostPost.description}</p>
                      

                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2"><Tag size={16} />{match.lostPost.category}</div>
                        <div className="flex items-center gap-2"><MapPin size={16} />{match.lostPost.location}</div>
                        <div className="flex items-center gap-2"><Calendar size={16} />{new Date(match.lostPost.date).toLocaleDateString()}</div>
                      </div>

                      {/* Show contact info only when confirmed and user is the found item reporter */}
                      {match.status === 'confirmed' && match.currentUserRole === 'found' && (
                        <div className="pt-3 border-t bg-green-50 p-3 rounded-lg mt-3">
                          <p className="text-sm font-medium text-green-700 mb-2">📞 Owner's Contact Information:</p>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail size={14} className="text-green-600" />
                            <a href={`mailto:${match.lostPost.user.email}`} className="hover:text-blue-600 font-medium">{match.lostPost.user.email}</a>
                          </div>
                          {match.lostPost.user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                              <Phone size={14} className="text-green-600" />
                              <span className="font-medium">{match.lostPost.user.phone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    

                    {/* Found Item */}
                    <div className="pl-6">
                      <h3 className="text-lg font-semibold text-green-600 mb-3">Found Item</h3>
                      {(match.foundPost.images && match.foundPost.images.length > 0) ? (
                        <ImageGallery images={match.foundPost.images} alt={match.foundPost.title} />
                      ) : match.foundPost.imageUrl && (
                        <img src={match.foundPost.imageUrl} alt={match.foundPost.title} className="w-full h-64 object-contain rounded-lg mb-3"/>
                      )}
                      <h4 className="font-semibold text-gray-900 mb-2">{match.foundPost.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{match.foundPost.description}</p>

                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2"><Tag size={16} />{match.foundPost.category}</div>
                        <div className="flex items-center gap-2"><MapPin size={16} />{match.foundPost.location}</div>
                        <div className="flex items-center gap-2"><Calendar size={16} />{new Date(match.foundPost.date).toLocaleDateString()}</div>
                      </div>

                      {/* Show contact info only when confirmed and user is the lost item owner */}
                      {match.status === 'confirmed' && match.currentUserRole === 'lost' && (
                        <div className="pt-3 border-t bg-green-50 p-3 rounded-lg mt-3">
                          <p className="text-sm font-medium text-green-700 mb-2">📞 Finder's Contact Information:</p>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail size={14} className="text-green-600" />
                            <a href={`mailto:${match.foundPost.user.email}`} className="hover:text-blue-600 font-medium">{match.foundPost.user.email}</a>
                          </div>
                          {match.foundPost.user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                              <Phone size={14} className="text-green-600" />
                              <span className="font-medium">{match.foundPost.user.phone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {canConfirm(match) && (
                    <div className="mt-6 flex gap-4 justify-center">
                      <button 
                        onClick={() => handleConfirmClick(match)} 
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                      >
                        <CheckCircle size={20}/> 
                        {match.currentUserRole === 'lost' ? 'Confirm & Prove Ownership' : 'Confirm & Add Observations'}
                      </button>
                      <button 
                        onClick={() => handleRejectMatch(match._id)} 
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                      >
                        <XCircle size={20}/> Not a Match
                      </button>
                    </div>
                  )}
                  
                  {/* Already confirmed message */}
                  {match.status === 'pending' && (
                    <div className="mt-6">
                      {match.currentUserRole === 'lost' && match.lostUserConfirmed && !match.foundUserConfirmed && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                          <Clock className="inline-block mr-2 text-yellow-600" size={18} />
                          <span className="text-yellow-800 font-medium">
                            Your ownership proof submitted! Waiting for the finder to confirm.
                          </span>
                        </div>
                      )}
                      {match.currentUserRole === 'found' && match.foundUserConfirmed && !match.lostUserConfirmed && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                          <Clock className="inline-block mr-2 text-yellow-600" size={18} />
                          <span className="text-yellow-800 font-medium">
                            Your observations submitted! Waiting for the owner to confirm.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {match.status === 'admin_review' && (
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                      <p className="text-purple-800 font-medium">
                        ✓ Both parties confirmed! Admin is reviewing the match. You will be notified of the decision.
                      </p>
                    </div>
                  )}
                  
                  {match.status === 'confirmed' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-green-800 font-medium">
                        ✓ Match Approved by Admin! You can now contact each other.
                      </p>
                    </div>
                  )}
                  
                  {match.status === 'rejected' && (
                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-gray-600 font-medium">
                        Match Rejected
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <LostUserConfirmationModal
        isOpen={showLostModal}
        onClose={() => { setShowLostModal(false); setSelectedMatch(null); }}
        onSubmit={handleLostUserSubmit}
        itemTitle={selectedMatch?.lostPost.title || ''}
        isSubmitting={isSubmitting}
      />
      
      <FoundUserConfirmationModal
        isOpen={showFoundModal}
        onClose={() => { setShowFoundModal(false); setSelectedMatch(null); }}
        onSubmit={handleFoundUserSubmit}
        itemTitle={selectedMatch?.foundPost.title || ''}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}