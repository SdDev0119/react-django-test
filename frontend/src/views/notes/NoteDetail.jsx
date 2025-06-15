import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import './Notes.css';

const NoteDetail = () => {
    // Extract note ID from URL parameters
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State management for note data and UI states
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', content: '' });
    
    // API instance with authentication
    const api = useAxios();

    // Fetch note data when component mounts or ID changes
    useEffect(() => {
        fetchNote();
    }, [id]);

    /**
     * Fetch individual note data from API
     * Populates both display state and edit form
     */
    const fetchNote = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/notes/${id}/`);
            setNote(response.data);
            // Pre-populate edit form with current note data
            setEditForm({
                title: response.data.title,
                content: response.data.content,
            });
            setError(null);
        } catch (error) {
            setError('Failed to fetch note');
            console.error('Error fetching note:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle note deletion with confirmation
     * Navigates back to notes list on successful deletion
     */
    const handleDelete = async () => {
        // Confirm deletion with user
        if (
            window.confirm(
                'Are you sure you want to delete this note? This action cannot be undone.'
            )
        ) {
            try {
                await api.delete(`/notes/${id}/`);
                // Navigate back to notes list after successful deletion
                navigate('/');
            } catch (error) {
                console.error('Error deleting note:', error);
                alert('Failed to delete note');
            }
        }
    };

    /**
     * Handle note update/edit functionality
     * Validates input and updates note data
     */
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Basic validation for required fields
        if (!editForm.title.trim() || !editForm.content.trim()) {
            alert('Please fill in both title and content');
            return;
        }

        try {
            // Update note via API
            const response = await api.put(`/notes/${id}/`, editForm);
            setNote(response.data);
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error('Error updating note:', error);
            alert('Failed to update note');
        }
    };

    /**
     * Format date string for display
     * More detailed format for individual note view
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state UI
    if (loading) {
        return (
            <div className="note-detail-container">
                <div className="loading">Loading note...</div>
            </div>
        );
    }

    // Error state or note not found UI
    if (error || !note) {
        return (
            <div className="note-detail-container">
                <div className="error-message">
                    {error || 'Note not found'}
                </div>
                <Link to="/" className="btn btn-primary">
                    Back to Notes
                </Link>
            </div>
        );
    }

    return (
        <div className="note-detail-container">
            {/* Header with navigation and action buttons */}
            <header className="note-detail-header">
                <Link to="/" className="back-link">
                    ← Back to Notes
                </Link>
                <div className="note-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit'}
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </header>

            {/* Conditional rendering: Edit form or note display */}
            {isEditing ? (
                // Edit mode: Show form for updating note
                <div className="edit-note-form">
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        title: e.target.value,
                                    })
                                }
                                className="form-input"
                                maxLength={200} // Enforce model constraint
                                placeholder="Note title..."
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                value={editForm.content}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        content: e.target.value,
                                    })
                                }
                                className="form-textarea"
                                rows={10}
                                placeholder="Note content..."
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // Display mode: Show note content
                <div className="note-content">
                    <h1 className="note-title">{note.title}</h1>
                    <div className="note-meta">
                        <span>Created: {formatDate(note.created_at)}</span>
                        <span>By: {note.user}</span>
                    </div>
                    <div className="note-body">
                        {/* Preserve line breaks in note content */}
                        {note.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteDetail;