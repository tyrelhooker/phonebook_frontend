import React, { useRef } from 'react';

const Filter = ({ handleSearch, searchResult }) => {
  const searchInput = useRef();

  const change = () => {
    handleSearch(searchInput.current.value);
  }

  return (
    <>
      Search for: 
      <input
        ref={searchInput}
        onChange={change}
        placeholder='Enter a name to search'
      />
    </>
  )
}

export default Filter;