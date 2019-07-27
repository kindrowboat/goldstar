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
  expect(chart.querySelector('table>thead>tr:first-child>td:nth-child(2)')).toHaveTextContent('01/01/2019');
  expect(chart.querySelector('table>tbody>tr:nth-child(1)>td:nth-child(1)')).toHaveTextContent('Kalai');
  expect(chart.querySelector('table>tbody>tr:nth-child(1)>td:nth-child(2)')).toHaveTextContent('TD');
  expect(chart.querySelector('table>tbody>tr:nth-child(2)>td:nth-child(1)')).toHaveTextContent('Tom');
  expect(chart.querySelector('table>tbody>tr:nth-child(2)>td:nth-child(2)')).toHaveTextContent('KW');

});
