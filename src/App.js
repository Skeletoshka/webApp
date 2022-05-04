import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Client from './Client';
import Post from "./Post"
import ProjectStatus from "./ProjectStatus"
import MoveStatus from "./MoveStatus"
import Worker from "./Worker"
import Company from "./Company";
import moment from 'moment';
import 'moment/locale/ru';

document.documentElement.lang = 'ru';
moment.locale('ru');

class App extends Component {
  render() {
      document.body.style = 'background: #61dafb;';
    return (
        <div id='main'>
        <BrowserRouter>
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/client' element={<Client />} />
              <Route path='/post' element={<Post />} />
              <Route path='/projectstatus' element={<ProjectStatus />} />
              <Route path='/movestatus' element={<MoveStatus />} />
              <Route path='/worker' element={<Worker />} />
              <Route path='/company' element={<Company />} />
          </Routes>
        </BrowserRouter>
        </div>
    )
  }
}

export default App;