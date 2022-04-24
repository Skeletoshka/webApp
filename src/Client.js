import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

class Client extends Component {

    emptyItem = {
        clientId:0,
        clientCompanyName: '',
        clientCity: '',
        clientStreet: '',
        clientHouse: '',
        clientEmail: '',
        clientPhoneNumber: '',
        clientName: '',
        clientLastName: '',
        clientMiddleName: '',
    };

    constructor(props) {
        super(props);
        this.state = {clients: [], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/client/getlist')
            .then(response => response.json())
            .then(data => this.setState({clients: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/client/delete`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });
        window.location.reload();
    }

    async change(id){
        const client = await (await fetch(`http://localhost:8090/client/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: client, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;

        await fetch('/client/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/client');
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item = this.state.item;
        item[name] = value;
        this.setState({item: item});
    };

    render() {
        const {clients, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const clientList = clients.map(client => {
                return <tr key={client.clientId}>
                    <td style={{whiteSpace: 'nowrap'}}>{client.clientCompanyName}</td>
                    <td>{client.clientCity}, {client.clientStreet} {client.clientHouse}</td>
                    <td>{client.clientEmail}</td>
                    <td>{client.clientPhoneNumber}</td>
                    <td>{client.clientLastName} {client.clientName} {client.clientMiddleName}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" onClick={() => this.change(client.clientId)}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(client.clientId)}>Delete</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            });
            return (
                <div>
                    <AppNavbar/>
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" onClick={()=>this.add()}>Add Client</Button>
                        </div>
                        <h3>Clients</h3>
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
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            const title = <h2>Редактирование информации о клиенте</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="clientCompanyName">Наименование компании</Label>
                                <Input type="text" name="clientCompanyName" id="clientCompanyName" defaultValue={item.clientCompanyName || ''}
                                       onChange={this.handleChange} autoComplete="clientCompanyName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientCity">Город</Label>
                                <Input type="text" name="clientCity" id="clientCity" defaultValue={item.clientCity || ''}
                                       onChange={this.handleChange} autoComplete="clientCity"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientStreet">Улица</Label>
                                <Input type="text" name="clientStreet" id="clientStreet" defaultValue={item.clientStreet || ''}
                                       onChange={this.handleChange} autoComplete="clientStreet"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientHouse">Дом</Label>
                                <Input type="text" name="clientHouse" id="clientHouse" defaultValue={item.clientHouse || ''}
                                       onChange={this.handleChange} autoComplete="clientHouse"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientEmail">Email</Label>
                                <Input type="text" name="clientEmail" id="clientEmail" defaultValue={item.clientEmail || ''}
                                       onChange={this.handleChange} autoComplete="clientEmail"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientPhoneNumber">Номер телефона</Label>
                                <Input type="text" name="clientPhoneNumber" id="clientPhoneNumber" defaultValue={item.clientPhoneNumber || ''}
                                       onChange={this.handleChange} autoComplete="clientPhoneNumber"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientName">Имя</Label>
                                <Input type="text" name="clientName" id="clientName" defaultValue={item.clientName || ''}
                                       onChange={this.handleChange} autoComplete="clientName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientLastName">Фамилия</Label>
                                <Input type="text" name="clientLastName" id="clientLastName" defaultValue={item.clientLastName || ''}
                                       onChange={this.handleChange} autoComplete="clientLastName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientMiddleName">Отчество</Label>
                                <Input type="text" name="clientMiddleName" id="clientMiddleName" defaultValue={item.clientMiddleName || ''}
                                       onChange={this.handleChange} autoComplete="clientMiddleName"/>
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" type="submit">Save</Button>{' '}
                                <Button color="secondary" onClick={()=>window.location.reload()}>Назад</Button>
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }
    }
}
export default Client;