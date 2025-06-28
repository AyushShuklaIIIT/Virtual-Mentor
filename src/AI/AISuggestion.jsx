import React, { useState, useCallback, useMemo } from 'react'
import './ai.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLightbulb, faRefresh, faExclamationTriangle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import taskService from '../api/taskService';
import HamburgerIcon from '../SVGs/HamburgerIcon';

const AISuggestion = ({ onOpenSidebar }) => {
  const STORAGE_KEYS = {
    PREVIOUS_SUGGESTIONS: 'ai_previous_suggestions',
    HAS_INITIALIZED: 'ai_has_initialized'
  };

  const loadPreviousSuggestions = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREVIOUS_SUGGESTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading previous suggestions:', error);
      return [];
    }
  }, []);

  const savePreviousSuggestions = useCallback((suggestions) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREVIOUS_SUGGESTIONS, JSON.stringify(suggestions));
    } catch (error) {
      console.error('Error saving previous suggestions:', error);
    }
  }, []);

  const loadInitializationState = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HAS_INITIALIZED);
      return stored === 'true';
    } catch (error) {
      console.error('Error loading initialization state:', error);
      return false;
    }
  }, []);

  const saveInitializationState = useCallback((state) => {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, state.toString());
    } catch (error) {
      console.error('Error saving initialization state:', error);
    }
  }, []);

  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [previousSuggestions, setPreviousSuggestions] = useState(loadPreviousSuggestions);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isAddingToNotes, setIsAddingToNotes] = useState(false);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(loadInitializationState);

  // Memoized values
  const toggleButtonText = useMemo(() => showHistory ? 'Hide' : 'Show', [showHistory]);

  // Truncate text for display
  const truncateText = useCallback((text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }, []);

  // Get formatted timestamp
  const getFormattedTimestamp = useCallback(() => {
    const now = new Date();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const suggestionDate = now.toDateString();

    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (suggestionDate === today) {
      return `Today, ${timeString}`;
    } else if (suggestionDate === yesterday) {
      return `Yesterday, ${timeString}`;
    } else {
      return now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }, []);

  // Update previous suggestions and save to localStorage
  const updatePreviousSuggestions = useCallback((updateFn) => {
    setPreviousSuggestions(prev => {
      const newSuggestions = updateFn(prev);
      savePreviousSuggestions(newSuggestions);
      return newSuggestions;
    });
  }, [savePreviousSuggestions]);

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async (isRetry = false, showTyping = true) => {
    try {
      setError(null);
      
      if (showTyping) {
        setIsLoading(true);
      } else {
        setIsLoadingNew(true);
      }

      const response = await taskService.getSuggestions();

      // Handle the correct API response format: { suggestions: "text" }
      if (typeof response?.suggestions === 'string') {
        const suggestionText = response.suggestions.trim();
        setCurrentSuggestion(suggestionText);
        setHasData(true);
        
        if (!hasInitialized) {
          setHasInitialized(true);
          saveInitializationState(true);
        }
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err.message || 'Failed to fetch suggestions from server');
      setHasData(false);
      setCurrentSuggestion('');
    } finally {
      setIsLoading(false);
      setIsLoadingNew(false);
    }
  }, [hasInitialized, saveInitializationState]);

  const getFirstSuggestion = useCallback(async () => {
    await fetchSuggestions(false, true);
  }, [fetchSuggestions]);

  // Get another suggestion
  const getAnotherSuggestion = useCallback(async () => {
    if (isLoadingNew || isLoading) return;

    // Add current suggestion to previous suggestions before getting a new one
    if (currentSuggestion) {
      const newSuggestion = {
        text: currentSuggestion,
        timestamp: getFormattedTimestamp(),
        id: Date.now()
      };

      updatePreviousSuggestions(prev => [newSuggestion, ...prev.slice(0, 9)]); // Keep only last 10
    }

    // Fetch new suggestion
    await fetchSuggestions(true, false);
  }, [currentSuggestion, fetchSuggestions, getFormattedTimestamp, isLoadingNew, isLoading, updatePreviousSuggestions]);

  // Toggle history visibility
  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  // Add to notes functionality
  const addToNotes = useCallback(() => {
    if (!currentSuggestion || isAddingToNotes) return;

    setIsAddingToNotes(true);

    // Add current suggestion to previous suggestions
    const newSuggestion = {
      text: currentSuggestion,
      timestamp: getFormattedTimestamp(),
      id: Date.now(),
      addedToNotes: true
    };

    updatePreviousSuggestions(prev => {
      // Check if this suggestion is already in history
      const exists = prev.some(s => s.text === currentSuggestion);
      if (exists) {
        // Update existing entry to mark as added to notes
        return prev.map(s =>
          s.text === currentSuggestion
            ? { ...s, addedToNotes: true, timestamp: getFormattedTimestamp() }
            : s
        );
      } else {
        // Add new entry
        return [newSuggestion, ...prev.slice(0, 9)]; // Keep only last 10
      }
    });

    // Reset button state after 2 seconds
    setTimeout(() => {
      setIsAddingToNotes(false);
    }, 2000);
  }, [currentSuggestion, getFormattedTimestamp, isAddingToNotes, updatePreviousSuggestions]);

  // Clear all previous suggestions
  const clearHistory = useCallback(() => {
    updatePreviousSuggestions(() => []);
  }, [updatePreviousSuggestions]);

  // Retry fetching suggestions
  const retrySuggestions = useCallback(() => {
    fetchSuggestions(true, true);
  }, [fetchSuggestions]);

  // Loading component
  const LoadingDots = () => (
    <div className="typing-dots text-gray-500 text-lg">
      <span className="typing-text">Thinking</span>
      <span className="dots">
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </span>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="error-container text-center p-4">
      <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-yellow-500 mb-2" />
      <p className="text-gray-600 mb-4">
        {error}
      </p>
      <button
        onClick={retrySuggestions}
        disabled={isLoadingNew || isLoading}
        className="retry-button px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isLoadingNew || isLoading ? 'Retrying...' : 'Try Again'}
      </button>
    </div>
  );

  // No data component
  const NoDataDisplay = () => (
    <div className="no-data-container text-center p-4">
      <FontAwesomeIcon icon={faLightbulb} className="h-8 w-8 text-gray-400 mb-2" />
      <p className="text-gray-600 mb-4">
        No suggestions available at the moment.
      </p>
      <button
        onClick={retrySuggestions}
        disabled={isLoadingNew || isLoading}
        className="retry-button px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isLoadingNew || isLoading ? 'Loading...' : 'Get Suggestions'}
      </button>
    </div>
  );

  // Welcome/Initial state component
  const WelcomeDisplay = () => (
    <div className="welcome-container text-center p-6">
      <div className="mb-4">
        <FontAwesomeIcon icon={faLightbulb} className="h-12 w-12 text-purple-400 mb-3" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Ready for AI Insights?
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Get personalized suggestions based on your tasks and productivity patterns
        </p>
      </div>
      <button
        onClick={getFirstSuggestion}
        disabled={isLoading}
        className="get-started-button flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 mx-auto"
      >
        <FontAwesomeIcon 
          icon={faPlay} 
          className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} 
        />
        {isLoading ? 'Getting Suggestions...' : 'Get My First Suggestion'}
      </button>
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-center p-4 md:p-8 ai-body min-h-screen flex-1 overflow-y-auto'>
      <button id='open-sidebar' className='absolute top-4 left-4 md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
        <HamburgerIcon />
      </button>
      <div className='container max-w-3xl mx-auto'>
        {/* Header */}
        <header className='text-center mb-8'>
          <h1 className='text-2xl md:text-3xl font-semibold text-gray-800 mb-2'>
            Your AI Mentor Suggests...
          </h1>
          <p className='text-gray-500 text-sm md:text-base'>
            Personalized insights to help you grow
          </p>
        </header>

        {/* Main Suggestion Card */}
        <div className='suggestion-container mb-8 relative'>
          {/* AI Avatar - Mobile: Above, Desktop: Left */}
          <div className='flex flex-col md:flex-row items-center justify-center mb-6'>
            {/* AI Avatar */}
            <div className='relative mb-4 md:mb-0 md:mr-4 order-1 md:order-1'>
              <div className='w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center'>
                <FontAwesomeIcon icon={faLightbulb} className='h-6 w-6 md:h-8 md:w-8 text-white' />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                hasData ? 'bg-green-400 pulse' : hasInitialized ? 'bg-gray-400' : 'bg-blue-400'
              }`}></div>
            </div>

            {/* Suggestion Text */}
            <div className='suggestion-card glass rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-lg order-2 md:order-2'>
              {!hasInitialized ? (
                <WelcomeDisplay />
              ) : isLoading ? (
                <LoadingDots />
              ) : error ? (
                <ErrorDisplay />
              ) : !hasData || !currentSuggestion ? (
                <NoDataDisplay />
              ) : (
                <blockquote className={`text-lg md:text-xl text-gray-700 font-medium leading-relaxed transition-opacity duration-500 ${isLoadingNew ? 'opacity-50' : 'opacity-100'}`}>
                  "{currentSuggestion}"
                </blockquote>
              )}
              
              {isLoadingNew && hasData && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-2xl">
                  <LoadingDots />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Only show when we have data */}
          {hasData && currentSuggestion && (
            <div className='flex flex-wrap justify-center gap-3 mt-4'>
              <button
                onClick={getAnotherSuggestion}
                disabled={isLoadingNew || isLoading}
                className='action-button flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <FontAwesomeIcon
                  icon={faRefresh}
                  className={`h-5 w-5 text-blue-600 mr-2 ${isLoadingNew ? 'animate-spin' : ''}`}
                />
                Get Another Suggestion
              </button>

              <button
                onClick={addToNotes}
                disabled={isAddingToNotes || isLoading}
                className={`action-button flex items-center px-4 py-2 border border-gray-200 rounded-full shadow-sm transition-all duration-200 ${
                  isAddingToNotes 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {isAddingToNotes ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to notes
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEdit} className='h-5 w-5 text-purple-600 mr-2' />
                    Add to Task Notes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* History Section - Only show when we have previous suggestions */}
        {previousSuggestions.length > 0 && (
          <div className='mt-12 mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-medium text-gray-700 flex items-center'>
                <FontAwesomeIcon icon={faClock} className='h-5 w-5 text-purple-600 mr-2' />
                Previous Suggestions ({previousSuggestions.length})
              </h2>
              <div className='flex items-center gap-2'>
                <button
                  onClick={clearHistory}
                  className='text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded'
                  title="Clear all history"
                >
                  Clear
                </button>
                <button
                  onClick={toggleHistory}
                  className='toggle-button text-sm text-purple-600 hover:text-purple-800 transition-colors'
                >
                  <span>{toggleButtonText}</span>
                  <svg xmlns='http://www.w3.org/2000/svg' className={`h-4 w-4 inline ml-1 transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke="currentColor">
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>
              </div>
            </div>

            <div className={`history-container transition-all duration-300 overflow-hidden ${
              showHistory ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className='relative timeline pl-8'>
                {previousSuggestions.map((suggestion, index) => (
                  <div key={suggestion.id} className={`timeline-item relative mb-4 glass rounded-lg p-4 suggestion-card slide-in ${suggestion.addedToNotes ? 'border-l-4 border-purple-500' : ''}`} style={{animationDelay: `${index * 0.1}s`}}>
                    <div className='flex items-start justify-between'>
                      <p className='text-gray-700 flex-1 suggestion-text' title={suggestion.text}>
                        "{truncateText(suggestion.text)}"
                      </p>
                      {suggestion.addedToNotes && (
                        <span className='ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full whitespace-nowrap'>
                          Added to notes
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-gray-400 mt-2'>{suggestion.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISuggestion