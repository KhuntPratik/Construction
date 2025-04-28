import React, { useState } from 'react';

function Cal() {
  const [value, setValue] = useState('');

  const handleClick = (e) => {
    setValue(value + e.target.value);
  };

  const calculateResult = () => {
    try {
      const fixedValue = value.replace(/\^/g, "**"); // Replace ^ with **
      setValue(String(eval(fixedValue)));
    } catch {
      setValue('Error');
    }
  };

  const handleScientific = (func) => {
    try {
      if (func === "%") {
        setValue(String(parseFloat(value) / 100)); // Convert to percentage
      } else {
        setValue(String(eval(`${func}(${parseFloat(value)})`)));
      }
    } catch {
      setValue('Error');
    }
  };

  return (
    <div className="container">
      <div className="calculator">
        <form>
          <div className='display'>
            <input type="text" value={value} readOnly />
          </div>
          <div>
            <input type="button" value="AC" onClick={() => setValue('')} />
            <input type="button" value="DE" onClick={() => setValue(value.slice(0, -1))} />
            <input type="button" value="." onClick={handleClick} />
            <input type="button" value="/" onClick={handleClick} />
          </div>
          <div>
            <input type="button" value="7" onClick={handleClick} />
            <input type="button" value="8" onClick={handleClick} />
            <input type="button" value="9" onClick={handleClick} />
            <input type="button" value="*" onClick={handleClick} />
          </div>
          <div>
            <input type="button" value="4" onClick={handleClick} />
            <input type="button" value="5" onClick={handleClick} />
            <input type="button" value="6" onClick={handleClick} />
            <input type="button" value="+" onClick={handleClick} />
          </div>
          <div>
            <input type="button" value="1" onClick={handleClick} />
            <input type="button" value="2" onClick={handleClick} />
            <input type="button" value="3" onClick={handleClick} />
            <input type="button" value="-" onClick={handleClick} />
          </div>
          <div>
            <input type="button" value="00" onClick={handleClick} />
            <input type="button" value="0" onClick={handleClick} />
            <input type="button" value="=" className='equal' onClick={calculateResult} />
          </div>
          <div>
            <input type="button" value="sin" onClick={() => handleScientific('Math.sin')} />
            <input type="button" value="cos" onClick={() => handleScientific('Math.cos')} />
            <input type="button" value="tan" onClick={() => handleScientific('Math.tan')} />
            <input type="button" value="log" onClick={() => handleScientific('Math.log')} />
          </div>
          <div>
            <input type="button" value="√" onClick={() => handleScientific('Math.sqrt')} />
            <input type="button" value="^" onClick={() => setValue(value + "^")} />
            <input type="button" value="%" onClick={() => handleScientific("%")} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cal;
