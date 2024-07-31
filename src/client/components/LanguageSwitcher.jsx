import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { text: 'English', value: 'en' },
    { text: '日本語', value: 'ja' },
    { text: '中文', value: 'zh' }
  ];

  const handleLanguageChange = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setSelectedLanguage(newLanguage);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="language-switcher" style={{ position: 'relative' }}>
      <div 
        onClick={toggleDropdown} 
        style={{ 
          fontSize: 14,
          color: '#fff', 
          borderRadius: '4px', 
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
           <i className="material-icons">language</i>
        {/* {languages.find(lang => lang.value === selectedLanguage).text} */}
      </div>
      {isOpen && (
        <div 
          style={{
            fontSize: 12,
            position: 'fixed',
            top: '12px',
            right: '12px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '8px 0',
            zIndex: 9999,
            width: '120px'
          }}
        >
          {languages.map((language, index) => (
            <div 
              key={index} 
              onClick={() => handleLanguageChange(language.value)} 
              style={{ 
                fontSize:12,
                padding: '8px 16px', 
                cursor: 'pointer', 
                color: '#333',
                textAlign: 'left',
                backgroundColor: selectedLanguage === language.value ? '#f1f1f1' : 'transparent',
                userSelect: 'none'
              }}
            >
              {language.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
