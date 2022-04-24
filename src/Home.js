import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {
    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <Button color="link"><Link to="/client">Клиенты</Link></Button>
                    <Button color="link"><Link to="/post">Должности</Link></Button>
                    <Button color="link"><Link to="/projectstatus">Статусы проекта</Link></Button>
                    <Button color="link"><Link to="/movestatus">Статусы движения</Link></Button>
                </Container>
            </div>
        );
    }
}
export default Home;