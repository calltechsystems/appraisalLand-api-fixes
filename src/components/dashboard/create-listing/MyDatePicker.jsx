import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyDatePicker = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  return (
    <DatePicker
      selected={selectedDateTime}
      onChange={(date) => setSelectedDateTime(date)}
      showTimeSelect
      timeFormat="HH:mm"
      minDate={Date()}  // Set minDate to null to allow past dates
      timeIntervals={15}
      dateFormat="yyyy/MM/dd h:mm aa"
      popperPlacement="bottom-end"
      min={getMinDateTime()}
      popperModifiers={{
        flip: {
          behavior: ['bottom'], // don't allow it to flip to be above
        },
        preventOverflow: {
          enabled: false, // tell it not to try to stay within the view (even if it means disappearing off-screen)
        },
        hide: {
          enabled: false, // turn off since needs preventOverflow to be enabled
        },
      }}
    />
  );
};

export default MyDatePicker;
