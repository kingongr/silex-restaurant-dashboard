// Test phone formatting functionality
import { formatPhoneNumber, getPhoneMaxLength, getPhoneMetadata, formatPhoneDigits } from './client/utils/validation';

// Test different countries
console.log('Testing phone formatting for different countries:');

// Test US
const usMetadata = { country: 'US', countryCode: '+1', digitCount: 10, formatPattern: 'XXX-XXX-XXXX', example: '555-123-4567', placeholder: 'XXX-XXX-XXXX' };
console.log('US:', formatPhoneDigits('5551234567', usMetadata));

// Test UK
const ukMetadata = { country: 'UK', countryCode: '+44', digitCount: 11, formatPattern: '0XXXX XXX XXX', example: '020 1234 5678', placeholder: '0XXXX XXX XXX' };
console.log('UK:', formatPhoneDigits('02012345678', ukMetadata));

// Test France
const frMetadata = { country: 'FR', countryCode: '+33', digitCount: 9, formatPattern: 'X XX XX XX XX', example: '1 23 45 67 89', placeholder: 'X XX XX XX XX' };
console.log('France:', formatPhoneDigits('123456789', frMetadata));

// Test max lengths
console.log('US maxLength:', usMetadata.formatPattern.length);
console.log('UK maxLength:', ukMetadata.formatPattern.length);
console.log('France maxLength:', frMetadata.formatPattern.length);
