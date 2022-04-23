import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ClientList from './ClientList';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';

document.documentElement.lang = 'ru';
moment.locale('ru');

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/client' element={<ClientList />} />
          </Routes>
        </BrowserRouter>
    )
  }
}

export default App;