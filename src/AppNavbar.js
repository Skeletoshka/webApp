import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import {Link} from 'react-router-dom';
import __ROLE__ from './CONST'

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
        if(__ROLE__.role === "DIR"){
            return <Navbar color="dark" dark expand="md">
                <NavbarBrand tag={Link} to="/client">Клиенты</NavbarBrand>
                <NavbarBrand tag={Link} to="/post">Должности</NavbarBrand>
                <NavbarBrand tag={Link} to="/projectstatus">Статусы проекта</NavbarBrand>
                <NavbarBrand tag={Link} to="/movestatus">Статусы движения</NavbarBrand>
                <NavbarBrand tag={Link} to="/worker">Сотрудники</NavbarBrand>
                <NavbarBrand tag={Link} to="/company">Компания</NavbarBrand>
                <NavbarBrand tag={Link} to="/order">Заказы</NavbarBrand>
                <NavbarBrand tag={Link} to="/report">Отчеты</NavbarBrand>
            </Navbar>;
        }
        if(__ROLE__.role === "PROG"){
            return <Navbar color="dark" dark expand="md">
                <NavbarBrand tag={Link} to="/move">Движения</NavbarBrand>
            </Navbar>;
        }
        if(__ROLE__.role === "TEST"){
            return <Navbar color="dark" dark expand="md">
                <NavbarBrand tag={Link} to="/move">Движения</NavbarBrand>
            </Navbar>;
        }
        if(__ROLE__.role === "ANALISE"){
            return <Navbar color="dark" dark expand="md">
                <NavbarBrand tag={Link} to="/order">Заказы</NavbarBrand>
                <NavbarBrand tag={Link} to="/project">Проекты</NavbarBrand>
                <NavbarBrand tag={Link} to="/task">Задания</NavbarBrand>
                <NavbarBrand tag={Link} to="/move">Движения</NavbarBrand>
            </Navbar>;
        }
        if(__ROLE__.role === "PROJECT"){
            return <Navbar color="dark" dark expand="md">
                <NavbarBrand tag={Link} to="/report">Отчеты</NavbarBrand>
            </Navbar>;
        }else{
            return <Navbar color="dark" dark expand="md"/>
        }
            /*return <Navbar color="dark" dark expand="md">
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
            return <Navbar color="dark" dark expand="md"></Navbar>*/
        }
    //}
}