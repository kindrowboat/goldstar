//@flow
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

beforeEach(() => {
  mock.onGet('/people').reply(200,
    [{
      id: 1,
      name: 'Kalai',
      initials: 'KW',
    },{
      id: 2,
      name: 'Tom',
      initials: 'TD',
    }]
  );
  mock.onGet('/due_dates').reply(200,
    [{
      id: 1,
      date: '07/01/2019',
    },{
      id: 2,
      date: '07/08/2019',
    }]
  );
  mock.onGet('/assignments').reply(200,
    [{
      id: 1,
      due_date_id: 1,
      to_person_id: 2,
      from_person_id: 1,
      complete: false
    },{
      id: 2,
      due_date_id: 1,
      to_person_id: 1,
      from_person_id: 2,
      complete: false
    }]
  );
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a StarChart component with people and assignments', async () => {
  const rendered = render(<App />);

  const chart = await waitForElement(() =>
    rendered.getByTestId('chart')
  );

  expect(chart).toHaveTextContent('Kalai');
  expect(chart.querySelector('table>thead>tr:first-child>td:nth-child(2)')).toHaveTextContent('07/01/2019');
  expect(chart.querySelector('table>thead>tr:first-child>td:nth-child(3)')).toHaveTextContent('07/08/2019');
  expect(chart.querySelector('table>tbody>tr:nth-child(1)>td:nth-child(1)')).toHaveTextContent('Kalai');
  expect(chart.querySelector('table>tbody>tr:nth-child(1)>td:nth-child(2)')).toHaveTextContent('TD');
  expect(chart.querySelector('table>tbody>tr:nth-child(1)>td:nth-child(3)')).toHaveTextContent('N/A');
  expect(chart.querySelector('table>tbody>tr:nth-child(2)>td:nth-child(1)')).toHaveTextContent('Tom');
  expect(chart.querySelector('table>tbody>tr:nth-child(2)>td:nth-child(2)')).toHaveTextContent('KW');
  expect(chart.querySelector('table>tbody>tr:nth-child(2)>td:nth-child(3)')).toHaveTextContent('N/A');

});
