import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLightbulb, faRefresh, faTimes, faExclamationTriangle, faPlay } from '@fortawesome/free-solid-svg-icons';
import taskService from '../api/taskService'

const AISuggestions = () => {
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasRequestedSuggestions, setHasRequestedSuggestions] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setHasRequestedSuggestions(true);
    
    try {
      const response = await taskService.getSuggestions();
      
      // Handle the response format where suggestions is a string
      if (response?.suggestions) {
        setSuggestions(response.suggestions);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setSuggestions('');
        setError('No suggestions received from AI');
      }
      
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      setError('Unable to connect to AI service. Please try again later.');
      
      // Optional: Set a fallback suggestion
      setSuggestions('Take a moment to review your current tasks and prioritize what needs your attention today.');
      
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div className='bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl shadow-sm p-4 border border-purple-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faRobot} className='text-purple-600' />
            <span className='font-semibold text-gray-800'>AI Assistant</span>
            {suggestions && (
              <div className='w-2 h-2 bg-green-500 rounded-full' title='New suggestion available'></div>
            )}
          </div>
          <button 
            onClick={() => setIsMinimized(false)}
            className='text-gray-500 hover:text-gray-700 transition-colors'
            title='Expand AI suggestions'
          >
            <FontAwesomeIcon icon={faLightbulb} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-purple-200'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center'>
            <FontAwesomeIcon icon={faRobot} className='text-white text-sm' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-800'>AI Suggestions</h3>
            {lastUpdated && (
              <p className='text-xs text-gray-500'>Updated at {lastUpdated}</p>
            )}
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {suggestions && (
            <button 
              onClick={fetchSuggestions}
              disabled={loading}
              className='text-gray-500 hover:text-purple-600 transition-colors disabled:opacity-50'
              title="Get new suggestion"
            >
              <FontAwesomeIcon icon={faRefresh} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          <button 
            onClick={() => setIsMinimized(true)}
            className='text-gray-500 hover:text-gray-700 transition-colors'
            title="Minimize"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className='flex flex-col items-center justify-center py-8'>
          <div className='w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2'></div>
          <p className='text-sm text-gray-600'>Getting AI insights...</p>
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-start space-x-3'>
            <FontAwesomeIcon icon={faExclamationTriangle} className='text-red-500 text-sm mt-0.5' />
            <div className='flex-1'>
              <p className='text-red-800 text-sm font-medium'>Connection Issue</p>
              <p className='text-red-600 text-xs mt-1'>{error}</p>
              <button 
                onClick={fetchSuggestions}
                className='mt-2 text-red-600 hover:text-red-800 text-xs font-medium underline'
              >
                Try Again
              </button>
            </div>
          </div>
          
          {/* Show fallback suggestion if available */}
          {suggestions && (
            <div className='mt-3 pt-3 border-t border-red-200'>
              <p className='text-xs text-red-600 mb-2'>Fallback suggestion:</p>
              <p className='text-sm text-gray-700'>{suggestions}</p>
            </div>
          )}
        </div>
      ) : suggestions ? (
        <div className='bg-white rounded-lg p-4 border border-gray-100 shadow-sm'>
          <div className='flex items-start space-x-3'>
            <div className='w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <FontAwesomeIcon icon={faLightbulb} className='text-xs' />
            </div>
            <div className='flex-1'>
              <h4 className='font-medium text-gray-800 text-sm mb-2'>AI Recommendation</h4>
              <p className='text-gray-700 text-sm leading-relaxed'>{suggestions}</p>
            </div>
          </div>
        </div>
      ) : (
        // Initial state with prominent Get Suggestions button
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
            <FontAwesomeIcon icon={faLightbulb} className='text-purple-600 text-2xl' />
          </div>
          <h4 className='font-medium text-gray-800 mb-2'>Ready for AI Insights?</h4>
          <p className='text-gray-600 text-sm mb-4 max-w-xs'>
            Get personalized suggestions to improve your productivity and task management
          </p>
          <button 
            onClick={fetchSuggestions}
            disabled={loading}
            className='flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
          >
            <FontAwesomeIcon 
              icon={faPlay} 
              className={`text-sm ${loading ? 'animate-spin' : ''}`} 
            />
            <span>{loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}</span>
          </button>
          {hasRequestedSuggestions && !loading && !suggestions && !error && (
            <p className='text-gray-500 text-xs mt-3'>
              No suggestions available at the moment
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AISuggestions;