import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import {Link} from 'react-router-dom';

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
            <NavbarBrand tag={Link} to="/client">Клиенты</NavbarBrand>
            <NavbarBrand tag={Link} to="/post">Должности</NavbarBrand>
            <NavbarBrand tag={Link} to="/projectstatus">Статусы проекта</NavbarBrand>
            <NavbarBrand tag={Link} to="/movestatus">Статусы движения</NavbarBrand>
            <NavbarBrand tag={Link} to="/worker">Сотрудники</NavbarBrand>
            <NavbarBrand tag={Link} to="/company">Компания</NavbarBrand>
            <NavbarBrand tag={Link} to="/order">Заказы</NavbarBrand>
            <NavbarBrand tag={Link} to="/project">Проекты</NavbarBrand>
            <NavbarBrand tag={Link} to="/task">Задания</NavbarBrand>
            <NavbarBrand tag={Link} to="/move">Движения</NavbarBrand>
            <NavbarBrand tag={Link} to="/report">Отчеты</NavbarBrand>
        </Navbar>;
    }
}