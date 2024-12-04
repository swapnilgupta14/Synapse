export const saveToLocalStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage', error);
    }
};

export const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};
