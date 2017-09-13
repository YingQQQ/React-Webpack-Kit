import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <p>Hello world</p>
    <ul>
      <li>
        <Link to="/home">Link</Link>
      </li>
      <li>
        <Link to="/page1">Link</Link>
      </li>
    </ul>
  </div>
);
