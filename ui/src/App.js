//@flow
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


function App() {
  const [state, setState] = useState({people: null});
  const { people } = state;

  if(people == null) {
    axios.get('/people')
      .then((response) => setState({people: response.data}));
  }


  if(people) {
    return (
      <div className="App">
        <div data-testid="chart">
          <table>
            <thead>
            <tr>
              <td/>
              <td>01/01/2019</td>
            </tr>
            </thead>
            <tbody>
            {people && people.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>TDKW</td>
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

export default App;
