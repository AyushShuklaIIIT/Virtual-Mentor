import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DateRangePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: value?.startDate || new Date(),
      endDate: value?.endDate || new Date(),
      key: 'selection'
    }
  ]);
  useEffect(() => {
    setRange([
      {
        startDate: value?.startDate || new Date(),
        endDate: value?.endDate || new Date(),
        key: 'selection'
      }
    ]);
  }, [value]);

  const handleChange = (item) => {
    const selected = item.selection;
    setRange([selected]);
    onChange?.({
      startDate: selected.startDate,
      endDate: selected.endDate
    });
  };

  return (
    <div className='relative'>
      <div
        className='date-range-picker flex items-center cursor-pointer'
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faCalendarAlt} className='text-gray-500 mr-2' />
        <span>
          {format(range[0].startDate, 'MMM d, yyyy')} - {format(range[0].endDate, 'MMM d, yyyy')}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className='text-gray-500 ml-2 text-xs' />
      </div>
      {open && (
        <div className='absolute z-50 bg-white shadow rounded mt-2'>
          <DateRange
            editableDateInputs={true}
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            ranges={range}
            maxDate={new Date()}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker