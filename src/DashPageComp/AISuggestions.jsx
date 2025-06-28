import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLightbulb, faRefresh, faTimes } from '@fortawesome/free-solid-svg-icons';

const AISuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      // Replace with actual AI API call
      // const response = await aiService.getSuggestions();
      // setSuggestions(response.suggestions);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (isMinimized) {
    return (
      <div className='bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl shadow-sm p-4 border border-purple-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <FontAwesomeIcon icon={faRobot} className='text-purple-600' />
            <span className='font-semibold text-gray-800'>AI Assistant</span>
          </div>
          <button 
            onClick={() => setIsMinimized(false)}
            className='text-gray-500 hover:text-gray-700 transition-colors'
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
          <h3 className='font-semibold text-gray-800'>AI Suggestions</h3>
        </div>
        <div className='flex items-center space-x-2'>
          <button 
            onClick={fetchSuggestions}
            disabled={loading}
            className='text-gray-500 hover:text-purple-600 transition-colors disabled:opacity-50'
            title="Refresh suggestions"
          >
            <FontAwesomeIcon icon={faRefresh} className={loading ? 'animate-spin' : ''} />
          </button>
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
        <div className='flex justify-center py-4'>
          <div className='w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin'></div>
        </div>
      ) : (
        <div className='space-y-3'>
          {suggestions.slice(0, 2).map((suggestion) => (
            <div 
              key={suggestion.id}
              className='bg-white rounded-lg p-3 border border-gray-100 hover:border-purple-200 transition-colors cursor-pointer'
            >
              <div className='flex items-start space-x-3'>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                  suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <FontAwesomeIcon icon={suggestion.icon} className='text-xs' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-medium text-gray-800 text-sm'>{suggestion.title}</h4>
                  <p className='text-gray-600 text-xs mt-1'>{suggestion.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          {suggestions.length > 2 && (
            <button className='w-full text-center text-purple-600 hover:text-purple-800 text-sm font-medium py-2'>
              View {suggestions.length - 2} more suggestions
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AISuggestions;