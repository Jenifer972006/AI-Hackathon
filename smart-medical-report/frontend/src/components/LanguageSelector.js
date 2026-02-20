import React from 'react';
import { FaGlobe } from 'react-icons/fa';

const INDIAN_LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Bengali', 'Gujarati', 'Marathi', 'Punjabi', 'Odia', 'Assamese',
  'Urdu', 'Konkani', 'Manipuri', 'Nepali', 'Sindhi', 'Kashmiri'
];

const LanguageSelector = ({ value, onChange, label = 'Select Language' }) => {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <FaGlobe color="#00d4ff" size={14} />
        {label}
      </label>
      <select
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ cursor: 'pointer' }}
      >
        {INDIAN_LANGUAGES.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};

export { INDIAN_LANGUAGES };
export default LanguageSelector;
