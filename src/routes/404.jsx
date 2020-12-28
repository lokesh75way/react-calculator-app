import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="d-flex align-items-center justify-content-center pt-5">
    <div>
      <h1>404</h1>
      <h2 className="pb-2">
        Oops, the page you&apos;re
        <br />
        looking for does not exist.
      </h2>
      <hr className="py-1" />
      <p className="pt-2 pb-3">
        You may want to head <Link to="/">back</Link> to the homepage. If you
        think something is broken, report a problem.
      </p>
    </div>
  </div>
);

export default NotFound;
