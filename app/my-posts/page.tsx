'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface Post {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  status: 'active' | 'resolved' | 'closed';
  date: string;
  imageUrl?: string;
  matches: number;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/posts/my_posts/my_posts.php', {
        credentials: 'include', 
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost/lost_and_found_backend/posts/my_posts/delete_post.php?id=${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        alert('Post deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleMarkResolved = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost/lost_and_found_backend/posts/my_posts/mark_resolved.php?id=${postId}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, status: 'resolved' as const } : post
        ));
        alert('Post marked as resolved');
      } else {
        throw new Error('Failed to mark resolved');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to mark post as resolved');
    }
  };

  const filteredPosts = posts.filter(post => activeTab === 'all' || post.type === activeTab);

  const stats = {
    total: posts.length,
    lost: posts.filter(p => p.type === 'lost').length,
    found: posts.filter(p => p.type === 'found').length,
    resolved: posts.filter(p => p.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-2">Manage your lost and found reports</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
            <div className="text-sm text-gray-600">Lost Items</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.found}</div>
            <div className="text-sm text-gray-600">Found Items</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('all')}
              >
                All Posts ({posts.length})
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'lost' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('lost')}
              >
                Lost Items ({stats.lost})
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'found' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('found')}
              >
                Found Items ({stats.found})
              </button>
            </nav>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found</p>
              <p className="text-gray-400 mt-2">
                {activeTab === 'all' 
                  ? 'You haven\'t created any posts yet.' 
                  : `You haven't created any ${activeTab} posts.`}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.type === 'lost' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {post.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : post.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">{post.description}</p>
                      
                      <div className="flex items-center mt-3 space-x-4">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Eye size={14} className="mr-1" />
                          {post.matches} potential matches
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleMarkResolved(post.id)}
                        disabled={post.status === 'resolved'}
                        className={`p-2 rounded-lg ${post.status === 'resolved' 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                        title="Mark as resolved"
                      >
                        <CheckCircle size={18} />
                      </button>
                      
                      <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200" title="Edit">
                        <Edit size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
