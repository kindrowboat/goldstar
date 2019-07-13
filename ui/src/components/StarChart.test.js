//@flow
import React from 'react';
import ReactDOM from 'react-dom';
import StarChart from './StarChart';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StarChart />, div);
  ReactDOM.unmountComponentAtNode(div);
});