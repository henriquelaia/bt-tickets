import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark'); // default to dark

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('hvac_theme');
        if (savedTheme && ['light', 'dark', 'night'].includes(savedTheme)) {
            setTheme(savedTheme);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('hvac_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(current => {
            if (current === 'light') return 'dark';
            if (current === 'dark') return 'night';
            return 'light';
        });
    };

    const setSpecificTheme = (newTheme) => {
        if (['light', 'dark', 'night'].includes(newTheme)) {
            setTheme(newTheme);
        }
    };

    const value = {
        theme,
        toggleTheme,
        setTheme: setSpecificTheme
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
