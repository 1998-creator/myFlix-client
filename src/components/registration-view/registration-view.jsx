import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";



axios.post('https://paytonmoviedatabase.herokuapp.com/users', {
    Username: username,
    Password: password,
    Email: email,
    Birthday: birthday
  })
  .then(response => {
    const data = response.data;
    console.log(data);
    window.open('/', '_self'); // the second argument '_self' is necessary so that the page will open in the current tab
  })
  .catch(e => {
    console.log('error registering the user')
  });