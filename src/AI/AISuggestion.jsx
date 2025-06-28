import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faLightbulb, 
  faRefresh, 
  faChevronDown, 
  faChevronUp,
  faCheck,
  faExclamationTriangle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import taskService from '../api/taskService';
import './ai.css';

const AISuggestion = () => {
  // State management
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [suggestionHistory, setSuggestionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [addingToNotes, setAddingToNotes] = useState(false);
  const [noteAdded, setNoteAdded] = useState(false);
  
  // Refs for animations
  const suggestionRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  // Fetch new suggestion from backend
  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Add minimum loading time for better UX
      const [response] = await Promise.all([
        taskService.getSuggestions(),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      if (response?.suggestions) {
        const newSuggestion = {
          id: Date.now(),
          text: response.suggestions,
          timestamp: new Date().toISOString(),
          addedToNotes: false
        };
        
        setCurrentSuggestion(newSuggestion);
        
        // Add to history if it's not the initial load
        if (currentSuggestion) {
          setSuggestionHistory(prev => [currentSuggestion, ...prev.slice(0, 9)]); // Keep last 10
        }
      } else {
        throw new Error('No suggestion received');
      }
    } catch (err) {
      console.error('Failed to fetch suggestion:', err);
      setError('Unable to get AI suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentSuggestion]);

  // Add suggestion to notes
  const addToNotes = useCallback(async () => {
    if (!currentSuggestion || addingToNotes) return;
    
    setAddingToNotes(true);
    
    try {
      // Simulate API call to add to notes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNoteAdded(true);
      setCurrentSuggestion(prev => ({ ...prev, addedToNotes: true }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setNoteAdded(false);
      }, 2000);
      
    } catch (err) {
      console.error('Failed to add to notes:', err);
    } finally {
      setAddingToNotes(false);
    }
  }, [currentSuggestion, addingToNotes]);

  // Toggle history visibility
  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  // Format timestamp for display
  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday, ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }) + ', ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSuggestion();
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Typing animation component
  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 text-gray-500">
      <span>Thinking</span>
      <div className="typing-dots">
        <span className="dot-1">.</span>
        <span className="dot-2">.</span>
        <span className="dot-3">.</span>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl mb-4" />
      <p className="text-red-600 text-center mb-4">{error}</p>
      <button
        onClick={fetchSuggestion}
        className="flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-600 hover:bg-red-100 transition-colors"
      >
        <FontAwesomeIcon icon={faRefresh} className="mr-2" />
        Try Again
      </button>
    </div>
  );

  // Suggestion content component
  const SuggestionContent = () => {
    if (loading) return <TypingIndicator />;
    if (error) return <ErrorDisplay />;
    if (!currentSuggestion) return null;

    return (
      <blockquote 
        ref={suggestionRef}
        className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed fade-in"
      >
        "{currentSuggestion.text}"
      </blockquote>
    );
  };

  // Action buttons component
  const ActionButtons = () => (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      <button
        onClick={fetchSuggestion}
        disabled={loading}
        className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon 
          icon={loading ? faSpinner : faRefresh} 
          className={`h-4 w-4 text-blue-600 mr-2 ${loading ? 'animate-spin' : ''}`} 
        />
        Get Another Suggestion
      </button>
      
      <button
        onClick={addToNotes}
        disabled={addingToNotes || !currentSuggestion || currentSuggestion.addedToNotes}
        className={`flex items-center px-4 py-2 border rounded-full shadow-sm transition-colors ${
          noteAdded || currentSuggestion?.addedToNotes
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        } disabled:cursor-not-allowed`}
      >
        <FontAwesomeIcon 
          icon={noteAdded || currentSuggestion?.addedToNotes ? faCheck : faEdit} 
          className={`h-4 w-4 mr-2 ${
            noteAdded || currentSuggestion?.addedToNotes ? 'text-green-600' : 'text-purple-600'
          }`} 
        />
        {noteAdded || currentSuggestion?.addedToNotes ? 'Added to Notes' : 'Add to Task Notes'}
      </button>
    </div>
  );

  // History item component
  const HistoryItem = ({ suggestion, index }) => (
    <div className="timeline-item relative mb-4 glass rounded-lg p-4 suggestion-card fade-in">
      <p className="text-gray-700 text-sm md:text-base">"{suggestion.text}"</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">{formatTimestamp(suggestion.timestamp)}</p>
        {suggestion.addedToNotes && (
          <span className="text-xs text-green-600 flex items-center">
            <FontAwesomeIcon icon={faCheck} className="mr-1" />
            Added to notes
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 ai-body min-h-screen">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Your AI Mentor Suggests...
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Personalized insights to help you grow
          </p>
        </header>

        {/* Main Suggestion Card */}
        <div className="suggestion-container mb-8 relative">
          <div className="flex items-start justify-center mb-6">
            {/* AI Avatar */}
            <div className="relative mr-4 flex-shrink-0">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            {/* Suggestion Text */}
            <div className="suggestion-card glass rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-lg">
              <SuggestionContent />
            </div>
          </div>

          {/* Action Buttons */}
          {!loading && !error && <ActionButtons />}
        </div>

        {/* History Section */}
        {suggestionHistory.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700 flex items-center">
                <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-purple-600 mr-2" />
                Previous Suggestions ({suggestionHistory.length})
              </h2>
              <button
                onClick={toggleHistory}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center"
              >
                <span className="mr-1">{showHistory ? 'Hide' : 'Show'}</span>
                <FontAwesomeIcon 
                  icon={showHistory ? faChevronUp : faChevronDown} 
                  className="h-4 w-4" 
                />
              </button>
            </div>

            {showHistory && (
              <div className="relative timeline pl-8 space-y-4">
                {suggestionHistory.map((suggestion, index) => (
                  <HistoryItem 
                    key={suggestion.id} 
                    suggestion={suggestion} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestion;