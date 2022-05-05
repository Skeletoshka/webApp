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
import Order from "./Order";
import Project from "./Project";
import Task from "./Task";
import Move from "./Move";
import Report from "./Report";

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
              <Route path='/order' element={<Order />} />
              <Route path='/project' element={<Project />} />
              <Route path='/task' element={<Task />} />
              <Route path='/move' element={<Move />} />
              <Route path='/report' element={<Report />} />
          </Routes>
        </BrowserRouter>
        </div>
    )
  }
}

export default App;