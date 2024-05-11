import React, { useState, useEffect } from 'react';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personService from './services/persons';


const Notification = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      color: 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px'
    }}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        if (Array.isArray(initialPersons.data)) {
          setPersons(initialPersons.data);
        } else {
          console.error('Expected an array of persons, but got:', initialPersons);
        }
      })
      .catch(error => {
        console.error('Failed to fetch persons:', error);
        setErrorMessage('Failed to load initial data');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    const personExists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase());
    
    if (personExists) {
      setErrorMessage(`${newName} is already added to the phonebook`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    personService.create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson.data)); 
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        console.error('Error adding person:', error);
        setErrorMessage('Failed to add person');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          setErrorMessage(`Information of ${person.name} has already been removed from server`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  const personsToShow = newFilter
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  );
};

export default App;
