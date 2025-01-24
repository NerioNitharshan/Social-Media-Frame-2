import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

export function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ name: '', slug: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setEvents(data);
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('events')
      .insert([newEvent]);

    if (!error) {
      setNewEvent({ name: '', slug: '' });
      loadEvents();
    }
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (!error) {
      loadEvents();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Event</h2>
          <form onSubmit={createEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event URL Slug
                </label>
                <input
                  type="text"
                  value={newEvent.slug}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens are allowed"
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Events</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{event.name}</h3>
                  <p className="text-sm text-gray-500">/{event.slug}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(`/admin/events/${event.id}`)}
                    className="px-4 py-2 text-sm text-green-600 hover:text-green-800"
                  >
                    Manage Frames
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}