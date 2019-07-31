//@flow
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


function App() {
  const [state, setState] = useState({people: null, dueDates: null, assignments: null});
  const { people, dueDates, assignments } = state;

  if(people == null) {
    axios.get('/people')
      .then((response) => setState({...state, people: response.data}));
  }
  if(dueDates == null) {
    axios.get('/due_dates')
      .then((response) => setState({...state, dueDates: response.data}))
  }
  if(assignments == null) {
    axios.get('/assignments')
      .then((response) => setState({...state, assignments: response.data}))
  }


  if(people && dueDates && assignments) {
    return (
      <div className="App">
        <div data-testid="chart">
          <table>
            <thead>
            <tr>
              <td/>
              {dueDates && dueDates.map(date => (
                <td key={date.id}>{date.date}</td>
              ))}
              <td></td>
            </tr>
            </thead>
            <tbody>
            {people && people.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                {dueDates.map(dueDate => (
                  <td>{getAssignedPerson(assignments, people, dueDate.id, person.id).initials}</td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <div>no people yet</div>
  }
}

function getAssignedPerson(assignments, people, due_date_id, people_id) {
  for(let assignment of assignments) {
    if (assignment.due_date_id === due_date_id && assignment.from_person_id === people_id) {
      return people.find(person => person.id === assignment.to_person_id);
    }
  }
  return {initials: "N/A"}
}

export default App;
