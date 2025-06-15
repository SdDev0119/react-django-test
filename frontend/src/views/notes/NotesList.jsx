import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import { useAuthStore } from '../../store/auth';
import './Notes.css';

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const api = useAxios();
    const navigate = useNavigate();
    const allUserData = useAuthStore((state) => state.allUserData);

    useEffect(() => {
        fetchNotes();
    }, []);

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

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!newNote.title.trim() || !newNote.content.trim()) {
            alert('Please fill in both title and content');
            return;
        }

        try {
            const response = await api.post('/notes/', newNote);
            setNotes([response.data, ...notes]);
            setNewNote({ title: '', content: '' });
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Failed to create note');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="notes-container">
                <div className="loading">Loading notes...</div>
            </div>
        );
    }

    return (
        <div className="notes-container">
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
                                maxLength={200}
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

            {error && <div className="error-message">{error}</div>}

            <div className="notes-grid">
                {notes.length === 0 ? (
                    <div className="empty-state">
                        <h3>No notes yet</h3>
                        <p>Create your first note to get started!</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="note-card">
                            <Link
                                to={`/notes/${note.id}`}
                                className="note-link"
                            >
                                <h3 className="note-title">{note.title}</h3>
                                <p className="note-preview">
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