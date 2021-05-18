import React, { useState, useEffect } from 'react';
import './App.css';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Person from './components/Person';
import personsService from './services/persons';
import Notification from './components/Notification';

const convertToCamelCase = (string) => {
  return string.split(' ')
    .map(spaces => spaces.trim())
    .map(letter => letter[0].toUpperCase() + letter.substring(1))
    .join(' ');
}

const clearInputValues = (nameInput, numberInput) => {
  console.log('nameInput', nameInput);
  nameInput.current.value = '';
  numberInput.current.value='';
  nameInput.current.focus();
}

// TODO: Change the messages so that successful messages have green border and error messages have red borders. 
const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => {
        setMessage(`${error}: Failed to retrieve persons.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }, [searchResult]);


  const handleAddPerson = (nameInput, phoneNumInput, entirePhoneNumInput, entireNameInput) => {
    const addPerson = () => {
      const newPersons =  
        {
          name: convertToCamelCase(nameInput),
          //TODO: add checks to normalize phoneNumInput
          number: phoneNumInput
        };

      personsService
        .create(newPersons)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
        })
      
      clearInputValues(entireNameInput, entirePhoneNumInput)
      setMessage(`${newPersons.name} was added to phonebook`)

      setTimeout(() => {
        setMessage(null)
      }, 5000) 
    }

    let foundPerson = persons.find(person => person.name.toLowerCase() === nameInput.toLowerCase());

    foundPerson 
      ? handleUpdate(foundPerson, entirePhoneNumInput, entireNameInput)
      : addPerson();
  }


  // TODO: fix the flow of this function. Maybe refactor the PersonForm Component?
  const handleUpdate = ( foundPerson, phoneNumInput, nameInput ) => {
    const {id, name} = foundPerson;
    const changePhoneNum = window.confirm(`${name} already exists. Would you like to change their phone number in the phonebook?`)

    if (changePhoneNum) {
      phoneNumInput.current.focus();
      const newPhoneNumber = phoneNumInput.current.value;
      const person = persons.find(n => n.id === id);
      const changedPhoneNum = { ...person, number: newPhoneNumber}

      personsService
        .update(id, changedPhoneNum)
        .then(returnedPerson => 
          setPersons(persons.map(person => 
            person.id !== id 
            ? person 
            : returnedPerson
          ))
        )
        .catch(error => setMessage(`${error}:  ${name}'s has previously been deleted`))

      setMessage(`${name}'s phone number has been changed`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    clearInputValues(nameInput, phoneNumInput)
  }


  const handleSearch = (searchInput) => {
    const addSearchResult = (result) => {
      const foundPersons = result();
      setSearchResult(foundPersons);      
    }

    const findPersons = () => {
        searchInput = searchInput.toUpperCase();
      
        return persons.filter(person => person.name.toUpperCase().includes(searchInput));
      }

    const noPersonsFound = () => {
      return console.log('No person found');
    }

    findPersons
      ? addSearchResult(findPersons)
      : noPersonsFound(); 
  }


  const handleRemoval = (id) => {
    const personToRemove = persons.find(n => 
      (n.id === id)
    )
    
    const confirmRemoval = window.confirm(`Delete ${personToRemove.name}?`)

    if (confirmRemoval) {
      const foundPersons = persons.filter(n => n.id !== id);
      console.log(foundPersons);

      personsService
        .remove(id)
        // TODO: Is it better to promise chain the setState or have them separate?
        .then(setPersons(foundPersons))
        .then(setSearchResult(searchResult.filter(n => n.id !== id)))
      
      setMessage(`${personToRemove.name} has been deleted`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }


  return (
    <div className="App">   
      <h2>Phonebook</h2>
      <h3>Name Search</h3>
      <Filter handleSearch={handleSearch} searchResult={searchResult} />
      <h3>Add Person to Phonebook</h3>
      <PersonForm handleAddPerson={handleAddPerson}/>
      <Notification message={message} />
      <h3>Results</h3>
      <Person searchResult={searchResult} handleRemoval={handleRemoval} />
    </div>
  );
}

export default App;
