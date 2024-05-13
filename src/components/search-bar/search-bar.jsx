import React, { useState } from 'react';

export const SearchBar = ({ handleSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        handleSearch(value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
};



