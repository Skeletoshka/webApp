import React, {useEffect} from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import {Button, Container, FormGroup, Label} from 'reactstrap';
import __ROLE__ from './CONST';
import {useNavigate} from "react-router-dom";


export default function Home(){

    let login = undefined;
    let password = undefined;

    const navigate = useNavigate();

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        if (target.name === "login"){login = value}
        if (target.name === "password"){password = value}
    }

    async function handleSubmit(event){
        event.preventDefault();
        if (login === "dir" && password === "dir") {
            __ROLE__.role = "DIR";
            navigate("/worker");
        }
        if (login === "prog" && password === "prog") {
            __ROLE__.role = "PROG";
            navigate("/move");
        }
        if (login === "test" && password === "test") {
            __ROLE__.role = "TEST";
            navigate("/move");
        }
        if (login === "analise" && password === "analise") {
            __ROLE__.role = "ANALISE";
            navigate("/move");
        }
        if (login === "project" && password === "project") {
            __ROLE__.role = "PROJECT";
            navigate("/report");
        }
    }

    return(
            <div>
                <AppNavbar/>
                <Container fluid>
                    <FormGroup>
                        <Label for="login">Логин</Label>
                        <input type="text" name="login" id="login" onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Пароль</Label>
                        <input type="text" name="password" id="password" onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit" onClick={handleSubmit}>Войти</Button>{' '}
                        <Button color="secondary" onClick={() => window.location.reload()}>Сброс</Button>
                    </FormGroup>
                </Container>
            </div>
    )
}