import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

const emptyItem = {
    clientId:0,
    clientCompanyName: ' ',
    clientCity: '',
    clientStreet: '',
    clientHouse: '',
    clientEmail: '',
    clientPhoneNumber: '',
    clientName: '',
    clientLastName: '',
    clientMiddleName: '',
};

export default function Client() {

    const [clients, setClients] = useState();
    const [clientList, setClientList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/client/getlist')
            .then(response => response.json())
            .then(data => setClients(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/client/delete`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });
        setAction("delete");
    }

    async function change(id){
        const client = await (await fetch(`http://localhost:8090/client/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setAction("change");
        setItem(client)
    }

    async function add(){
        setAction("add");
    }

    async function handleSubmit(event) {
        await fetch('http://localhost:8090/client/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item1 = item;
        item1[name] = value;
        setItem(item1);
    }

    function view(){
        setClientList(clients.map(client => {
            return <tr key={client.clientId}>
                <td style={{whiteSpace: 'nowrap'}}>{client.clientCompanyName}</td>
                <td>{client.clientCity}, {client.clientStreet} {client.clientHouse}</td>
                <td>{client.clientEmail}</td>
                <td>{client.clientPhoneNumber}</td>
                <td>{client.clientLastName} {client.clientName} {client.clientMiddleName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" onClick={() => change(client.clientId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button" onClick={() => remove(client.clientId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
    }

    if(action === "get" || action === "delete") {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={()=>add()}>Добавить клиента</Button>
                        <Button color="warning" onClick={()=>view()}>Обновить</Button>
                    </div>
                    <h3>Клиенты</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="15%">Имя компании</th>
                            <th width="30%">Адрес компании</th>
                            <th width="15%">Email</th>
                            <th width="15%">Номер телефона</th>
                            <th width="50%">Директор</th>
                            <th width="40%">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                            {clientList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
    if(action === "change" || action === "add"){
        const title = <h2>Редактирование информации о клиенте</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="clientCompanyName">Наименование компании</Label>
                            <Input type="text" name="clientCompanyName" id="clientCompanyName" defaultValue={item.clientCompanyName || ''}
                                   onChange={handleChange} autoComplete="clientCompanyName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientCity">Город</Label>
                            <Input type="text" name="clientCity" id="clientCity" defaultValue={item.clientCity || ''}
                                   onChange={handleChange} autoComplete="clientCity"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientStreet">Улица</Label>
                            <Input type="text" name="clientStreet" id="clientStreet" defaultValue={item.clientStreet || ''}
                                   onChange={handleChange} autoComplete="clientStreet"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientHouse">Дом</Label>
                            <Input type="text" name="clientHouse" id="clientHouse" defaultValue={item.clientHouse || ''}
                                   onChange={handleChange} autoComplete="clientHouse"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientEmail">Email</Label>
                            <Input type="text" name="clientEmail" id="clientEmail" defaultValue={item.clientEmail || ''}
                                   onChange={handleChange} autoComplete="clientEmail"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientPhoneNumber">Номер телефона</Label>
                            <Input type="text" name="clientPhoneNumber" id="clientPhoneNumber" defaultValue={item.clientPhoneNumber || ''}
                                   onChange={handleChange} autoComplete="clientPhoneNumber"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientName">Имя</Label>
                            <Input type="text" name="clientName" id="clientName" defaultValue={item.clientName || ''}
                                   onChange={handleChange} autoComplete="clientName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientLastName">Фамилия</Label>
                            <Input type="text" name="clientLastName" id="clientLastName" defaultValue={item.clientLastName || ''}
                                   onChange={handleChange} autoComplete="clientLastName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientMiddleName">Отчество</Label>
                            <Input type="text" name="clientMiddleName" id="clientMiddleName" defaultValue={item.clientMiddleName || ''}
                                   onChange={handleChange} autoComplete="clientMiddleName"/>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" onClick={() => handleSubmit()}>Сохранить</Button>{' '}
                            <Button color="secondary" onClick={()=>setAction("get")}>Назад</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }

}