(function () {

    const ReactDOM = require('react-dom');
    const React = require('react');
    const {Timer} = require('./timer');

    ReactDOM.render(
    <Timer />,
    document.getElementById('top-container')
    );
}) ();