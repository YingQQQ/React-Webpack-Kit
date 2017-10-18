import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <p>Hello world</p>
    <ul>
      <li>
        <Link to="/home">Link Home</Link>
      </li>
      <li>
        <Link to="/page1">Link Page1</Link>
      </li>
      <li>
        <Link to="/page3">Link NoMatch</Link>
      </li>
    </ul>
  </div>
);
