/**
 *
 * SanitizedFormattedNumber
 *
 */

import React from 'react';
import { FormattedNumber } from 'react-intl';
import { DEFAULT_NOT_NUMBER } from 'containers/App/constants';

function SanitizedFormattedNumber(props) {
  const isNumeric = (data) => (!isNaN(parseFloat(data)) && isFinite(data) && data.constructor !== Array);
  const value = parseFloat(props.value, 10).toString();
  const fractionDigits = value.slice(value.indexOf('.') + 1).length;
  
  const number = (isNumeric(props.value) ?
      <FormattedNumber
        value={value}
        minimunFractionDigits={fractionDigits}
        maximumFractionDigits={fractionDigits}
      /> :
      <span>{DEFAULT_NOT_NUMBER}</span>
  );
  
  return number;
}

SanitizedFormattedNumber.propTypes = {};

export default SanitizedFormattedNumber;
