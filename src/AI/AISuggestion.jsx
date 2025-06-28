import React, { useEffect } from 'react'
import './ai.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const AISuggestion = () => {

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('suggestion-text').classList.remove('hidden');
    }, 1500);

    const toggleBtn = document.getElementById('toggle-history');
    const historyContainer = document.getElementById('history-container');
    const toggleText = document.getElementById('toggle-text');
    const toggleIcon = document.getElementById('toggle-icon');

    toggleBtn.addEventListener('click', () => {
      historyContainer.classList.toggle('hidden');
      if(historyContainer.classList.contains('hidden')) {
        toggleText.textContent = 'Show';
        toggleIcon.setAttribute('d', 'M5 15l7-7 7 7');
      } else {
        toggleText.textContent = 'Hide';
        toggleIcon.setAttribute('d', 'M5 9l-7 7 7-7');
      }
    });

    document.getElementById('get-another').addEventListener('click', () => {
      const suggestions = [
        "You tend to complete most tasks after 3 PM - try scheduling deep work then.",
        "Your meeting-free blocks on Wednesday mornings show 30% higher productivity.",
        "Consider time-blocking your calendar for focused work sessions.",
        "You've been consistently achieving your goals before deadlines this month.",
        "Your productivity peaks after your morning coffee break around 10:30 AM."
      ];

      // show loading
      document.getElementById('suggestion-text').classList.add('hidden');
      document.getElementById('loading').classList.remove('hidden');

      setTimeout(() => {
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        document.getElementById('suggestion-text').textContent = `"${randomSuggestion}"`;
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('suggestion-text').classList.remove('hidden');
      }, 1000);
    });

    // Add to notes
    document.getElementById('add-notes').addEventListener('click', () => {
      this.classList.remove('bg-white');
      this.classList.add('bg-purple-50');
      this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Added to notes
      `;
      setTimeout(() => {
        this.classList.remove('bg-purple-50');
        this.classList.add('bg-white');
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 00" />
        </svg>
        Add to Task Notes
        `
      }, 2000);
    })
  }, [])
  

  return (
    <div className='flex flex-col items-center justify-center p-4 md:p-8'>
      <div className='container max-w-3xl mx-auto'>
        {/* Header */}
        <header className='text-center mb-8'>
          <h1 className='text-2xl md:text-3xl font-semibold text-gray-800 mb-2'>Your AI Mentor Suggests...</h1>
          <p className='text-gray-500 text-sm md:text-base'>Personalized insights to help you grow</p>
        </header>

        {/* Main Suggestion Card */}
        <div className='suggestion-container mb-8 relative'>
          <div className='flex items-center justify-center mb-6'>
            {/* AI Avatar */}
            <div className='relative mr-4'>
              <div className='w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center'>
                <FontAwesomeIcon icon={faLightbulb} className='h-6 w-6 md:h-8 md:w-8 text-white' />
              </div>
              <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
            </div>

            {/* Suggestion Text */}
            <div id='suggestion-card' className='suggestion-card glass rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-lg'>
              <div id='loading' className='typing-dots text-gray-500 text-lg'>Thinking</div>
              <blockquote id='suggestion-text' className='text-lg md:text-xl text-gray-700 font-medium leading-relaxed hidden fade-in'>
                "To enhance your productivity, consider setting specific time blocks for focused work. This can help you minimize distractions and maximize your output. Remember to take short breaks to recharge. Use Pomodoro technique for effective time management."
              </blockquote>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap justify-center gap-3 mt-4'>
            <button id='get-another' className='flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors'>
              <FontAwesomeIcon icon={faLightbulb} className='h-5 w-5 text-gray-600 mr-2' />
              Get Another Suggestion
            </button>
            <button id='add-notes' className='flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors'>
              <FontAwesomeIcon icon={faLightbulb} className='h-5 w-5 text-gray-600 mr-2' />
              Add to Task Notes
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className='mt-12 mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-medium text-gray-700 flex items-center'>
              <FontAwesomeIcon icon={faLightbulb} className='h-5 w-5 text-gray-600 mr-2' />
              Previous Suggestions
            </h2>
            <button id='toggle-history' className='text-sm text-purple-600 hover:text-purple-800 transition-colors'>
              <span id='toggle-text'>Hide</span>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 inline ml-1' fill='none' viewBox='0 0 24 24' stroke="currentColor">
                <path id='toggle-icon' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
          </div>

          <div id='history-container' className='relative timeline pl-8'>
            <div className='timeline-item relative mb-4 glass rounded-lg p-4 suggestion-card'>
              <p className='text-gray-700'>"Consider taking short 5-minute breaks between tasks to maintain focus throughout the day."</p>
              <p className='text-xs text-gray-400 mt-2'>Today, 10:45 AM</p>
            </div>
            <div className='timeline-item relative mb-4 glass rounded-lg p-4 suggestion-card'>
              <p className='text-gray-700'>"Your calendar shows frequent context switching. Try grouping similar tasks together."</p>
              <p className='text-xs text-gray-400 mt-2'>Yesterday, 3:22 PM</p>
            </div>
            <div className='timeline-item relative mb-4 glass rounded-lg p-4 suggestion-card'>
              <p className='text-gray-700'>"Based on your productivity patterns, Mondays might be better for planning rather than execution."</p>
              <p className='text-xs text-gray-400 mt-2'>May 15, 2:10 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISuggestion
