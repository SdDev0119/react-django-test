import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import { useAuthStore } from '../../store/auth';
import './Notes.css';

const NotesList = () => {
    // State management for notes data and UI states
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    
    // Hooks for API calls, navigation, and user data
    const api = useAxios();
    const navigate = useNavigate();
    const allUserData = useAuthStore((state) => state.allUserData);

    // Fetch notes when component mounts
    useEffect(() => {
        fetchNotes();
    }, []);

    /**
     * Fetch all notes for the current user from the API
     * Updates loading state and handles errors appropriately
     */
    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notes/');
            setNotes(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch notes');
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle creation of a new note
     * Validates input and updates the notes list on success
     */
    const handleCreateNote = async (e) => {
        e.preventDefault();
        
        // Basic validation for required fields
        if (!newNote.title.trim() || !newNote.content.trim()) {
            alert('Please fill in both title and content');
            return;
        }

        try {
            // Create new note via API
            const response = await api.post('/notes/', newNote);
            // Add new note to the beginning of the list (newest first)
            setNotes([response.data, ...notes]);
            // Reset form and hide create form
            setNewNote({ title: '', content: '' });
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Failed to create note');
        }
    };

    /**
     * Format date string for display
     * Converts ISO date to readable format
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state UI
    if (loading) {
        return (
            <div className="notes-container">
                <div className="loading">Loading notes...</div>
            </div>
        );
    }

    return (
        <div className="notes-container">
            {/* Header section with user info and actions */}
            <header className="notes-header">
                <div className="header-content">
                    <h1>My Notes</h1>
                    <div className="header-actions">
                        <span className="welcome-text">
                            Welcome, {allUserData?.username}
                        </span>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            {showCreateForm ? 'Cancel' : 'New Note'}
                        </button>
                        <Link to="/logout" className="btn btn-secondary">
                            Logout
                        </Link>
                    </div>
                </div>
            </header>

            {/* Conditional rendering of create note form */}
            {showCreateForm && (
                <div className="create-note-form">
                    <h3>Create New Note</h3>
                    <form onSubmit={handleCreateNote}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Note title..."
                                value={newNote.title}
                                onChange={(e) =>
                                    setNewNote({
                                        ...newNote,
                                        title: e.target.value,
                                    })
                                }
                                className="form-input"
                                maxLength={200} // Enforce model constraint
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Write your note content here..."
                                value={newNote.content}
                                onChange={(e) =>
                                    setNewNote({
                                        ...newNote,
                                        content: e.target.value,
                                    })
                                }
                                className="form-textarea"
                                rows={4}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Create Note
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Error message display */}
            {error && <div className="error-message">{error}</div>}

            {/* Notes grid or empty state */}
            <div className="notes-grid">
                {notes.length === 0 ? (
                    // Empty state when no notes exist
                    <div className="empty-state">
                        <h3>No notes yet</h3>
                        <p>Create your first note to get started!</p>
                    </div>
                ) : (
                    // Render notes grid
                    notes.map((note) => (
                        <div key={note.id} className="note-card">
                            <Link
                                to={`/notes/${note.id}`}
                                className="note-link"
                            >
                                <h3 className="note-title">{note.title}</h3>
                                <p className="note-preview">
                                    {/* Truncate long content for preview */}
                                    {note.content.length > 150
                                        ? `${note.content.substring(0, 150)}...`
                                        : note.content}
                                </p>
                                <div className="note-meta">
                                    <span className="note-date">
                                        {formatDate(note.created_at)}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotesList;