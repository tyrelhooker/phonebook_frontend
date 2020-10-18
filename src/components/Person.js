import React from 'react';

const Person = ({ searchResult, handleRemoval }) => {
  return (
    <>
      <table>
        <tbody>
          {searchResult === undefined 
            ? <tr><td>None: Search for a name to display results</td></tr> 
            : searchResult.map(val =>
              <tr key={val.id}>
                <td> {val.name} </td>
                <td>{'.'.repeat(10)}</td>
                <td>{val.number}</td>
                <td>
                  <button onClick={() => handleRemoval(val.id)}>
                    delete
                  </button>
                </td>
              </tr> 
            )
          }
        </tbody>
      </table>
      
     
    </>
  )
}

export default Person;