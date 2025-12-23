import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import chroma from 'chroma-js';

// TODO: Implement or find these helpers in the project
// For now, these are basic stubs.
const sendMsg = (type, payload) => console.log('sendMsg:', type, payload);
const isEmpty = (obj) => Object.keys(obj).length === 0;
const queryParamsIsTrue = (param) => param === 'true';
const objectToSearchParams = (obj) => {
  const params = new URLSearchParams();
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      params.append(key, typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key]);
    }
  }
  return params.toString();
};
const logger = { error: (...args) => console.error(...args) };

// Utils from ThemeEditor
import { generateColorScheme } from '../components/ThemeEditor/utils/generateColorScheme';
import { isLightColor } from '../components/ThemeEditor/utils/isLightColor';

const ThemeEditorContext = createContext(null);

export const useThemeEditor = () => {
  const context = useContext(ThemeEditorContext);
  if (!context) {
    throw new Error('useThemeEditor must be used within a ThemeEditorProvider');
  }
  return context;
};

export const ThemeEditorProvider = ({ children }) => {
  const [isThemeEditorMode, setIsThemeEditorModeState] = useState(false);
  const [isLightTheme, setIsLightThemeState] = useState(false);
  const [alert, setAlert] = useState(null); // Simple alert state
  const [themeEditorData, setThemeEditorData] = useState({});
  const [defaultThemeVars, setDefaultThemeVars] = useState({});
  const [isThemeSettledByThemeEditor, setIsThemeSettledByThemeEditor] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Assuming initial false for desktop
  const appRootRef = useRef(document.querySelector(':root')); // Direct access to :root

  // Placeholder for mobx.ui object
  const ui = {
    isThemeEditorMode,
    setIsThemeEditorMode: ({ isEnableThemeEditor }) => setIsThemeEditorModeState(isEnableThemeEditor),
    setIsLightTheme: setIsLightThemeState,
    setAlert,
    themeEditorData,
    setThemeEditorData, // Allow setting themeEditorData for external updates
    defaultThemeVars,
    setDefaultThemeVars, // Allow setting defaultThemeVars
    setIsThemeSettledByThemeEditor,
    isMobile,
    appRoot: appRootRef.current, // Use ref for appRoot
  };

  const value = {
    ui,
    chroma,
    sendMsg,
    isEmpty,
    queryParamsIsTrue,
    objectToSearchParams,
    logger,
    generateColorScheme,
    isLightColor,
  };

  return (
    <ThemeEditorContext.Provider value={value}>
      {children}
    </ThemeEditorContext.Provider>
  );
};
