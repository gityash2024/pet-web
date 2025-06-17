import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
export const SavedItemsContext = createContext();

// Create custom hook for using the context
export const useSavedItems = () => {
  return useContext(SavedItemsContext);
};

// Create provider component
export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);
  
  // Load saved items from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem('savedItems');
    if (storedItems) {
      setSavedItems(JSON.parse(storedItems));
    }
  }, []);
  
  // Update localStorage whenever savedItems changes
  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);
  
  // Add item to saved items
  const addSavedItem = (item) => {
    setSavedItems(prevItems => {
      // Check if item already exists
      if (prevItems.some(prevItem => prevItem.id === item.id)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  };
  
  // Remove item from saved items
  const removeSavedItem = (itemId) => {
    setSavedItems(prevItems => 
      prevItems.filter(item => item.id !== itemId)
    );
  };
  
  // Check if an item is saved
  const isItemSaved = (itemId) => {
    return savedItems.some(item => item.id === itemId);
  };
  
  // Clear all saved items
  const clearSavedItems = () => {
    setSavedItems([]);
  };
  
  const value = {
    savedItems,
    addSavedItem,
    removeSavedItem,
    isItemSaved,
    clearSavedItems
  };
  
  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export default SavedItemsProvider; 