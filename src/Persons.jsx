const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map(person => (
        <Person
          key={person.id}
          id={person.id}
          name={person.name}
          number={person.number}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const Person = ({ name, number, onDelete, id }) => {
  return (
    <div>
      {name} {number}
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

          

export default Persons;
