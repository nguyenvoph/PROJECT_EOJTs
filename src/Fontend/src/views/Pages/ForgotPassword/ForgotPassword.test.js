import React from 'react';
import ReactDOM from 'react-dom';
import FotgotPassword from './ForgotPassword';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FotgotPassword />, div);
  ReactDOM.unmountComponentAtNode(div);
});
