import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class Order extends Component {

    emptyItem = {
        orderId:0,
        workerId:1,
        workerLastName: '',
        workerName: '',
        workerMiddleName: '',
        orderTermsContract: '',
        orderObligationCustomer: '',
        orderObligationContractor: '',
        orderRegulatoryDocument: '',
        clientId: 1,
        clientCompanyName: '',
        orderDateOpen: new Date().toISOString(),
        orderDateClose: new Date().toISOString(),
    };

    constructor(props) {
        super(props);
        this.state = {orders: [], workers:[], clients:[], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/order/getlist')
            .then(response => response.json())
            .then(data => this.setState({orders: data}));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => this.setState({workers: data}));
        fetch('http://localhost:8090/client/getlist')
            .then(response => response.json())
            .then(data => this.setState({clients: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/order/delete`, {
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
        const order = await (await fetch(`http://localhost:8090/order/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: order, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;
        await fetch('http://localhost:8090/order/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/order');
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item = this.state.item;
        item[name] = value;
        this.setState({item: item});
    };

    postChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item = this.state.item;
        item[name] = value;
        this.setState({item: item});
    }

    //todo тут даты тоже есть
    render() {
        const {orders, clients, workers, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const orderList = orders.map(order => {
                return <tr key={order.orderId}>
                    <td style={{whiteSpace: 'nowrap'}}>{order.clientCompanyName}</td>
                    <td>{order.orderTermsContract}</td>
                    <td>{order.orderObligationCustomer}</td>
                    <td>{order.orderObligationContractor}</td>
                    <td>{order.orderRegulatoryDocument}</td>
                    <td>{order.workerLastName} {order.workerName} {order.workerMiddleName}</td>
                    <td>{new Date(order.orderDateOpen).getDate()}.{new Date(order.orderDateOpen).getMonth()}.{new Date(order.orderDateOpen).getFullYear()}</td>
                    <td>{new Date(order.orderDateClose).getDate()}.{new Date(order.orderDateClose).getMonth()}.{new Date(order.orderDateClose).getFullYear()}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary"
                                    onClick={() => this.change(order.orderId)}>Редактировать</Button>
                            <Button size="sm" id="delete-button"
                                    onClick={() => this.remove(order.orderId)}>Удалить</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            });
            return (
                <div>
                    <AppNavbar/>
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" onClick={()=>this.add()}>Добавить заказ</Button>
                        </div>
                        <h3>Компании</h3>
                        <Table className="mt-4">
                            <thead>
                            <tr>
                                <th width="15%">Имя компании</th>
                                <th width="25%">Термины договора</th>
                                <th width="25%">Обязательства заказчика</th>
                                <th width="25%">Обязательства исполнителя</th>
                                <th width="25%">Нормативные документы</th>
                                <th width="25%">Ответственный сотрудник</th>
                                <th width="20%">Дата открытия договора</th>
                                <th width="15%">Дата закрытия договора</th>
                            </tr>
                            </thead>
                            <tbody>
                                {orderList}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            );
        }
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            const workerList = workers.map(worker => {
                return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
            })
            const clientList = clients.map(client => {
                return <option value = {client.clientId}>{client.clientCompanyName}</option>
            })
            const title = <h2>Редактирование информации о заказе</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="clientId">Наименование компании</Label>
                                <select name="clientId" id="clientId" defaultValue={item.clientId || ''}
                                        onChange={this.handleChange} autoComplete="clientId">{clientList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="orderTermsContract">Термины договора</Label>
                                <Input type="text" name="orderTermsContract" id="orderTermsContract"
                                       defaultValue={item.orderTermsContract || ''}
                                       onChange={this.handleChange} autoComplete="orderTermsContract"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="orderObligationCustomer">Обязательства заказчика</Label>
                                <Input type="text" name="orderObligationCustomer" id="orderObligationCustomer"
                                       defaultValue={item.orderObligationCustomer || ''}
                                       onChange={this.handleChange} autoComplete="orderObligationCustomer"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="orderObligationContractor">Обязательства исполнителя</Label>
                                <Input type="text" name="orderObligationContractor" id="orderObligationContractor"
                                       defaultValue={item.orderObligationContractor || ''}
                                       onChange={this.handleChange} autoComplete="orderObligationContractor"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="orderRegulatoryDocument">Нормативные документы</Label>
                                <Input type="text" name="orderRegulatoryDocument" id="orderRegulatoryDocument"
                                       defaultValue={item.orderRegulatoryDocument || ''}
                                       onChange={this.handleChange} autoComplete="orderRegulatoryDocument"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerId">Ответственный сотрудник</Label>
                                <select name="workerId" id="workerId" defaultValue={item.workerId || ''}
                                        onChange={this.handleChange} autoComplete="workerId">{workerList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="orderDateOpen">Дата открытия договора</Label>
                                <Input type="text" name="orderDateOpen" id="orderDateOpen"
                                       defaultValue={item.orderDateOpen || ''}
                                       onChange={this.handleChange} autoComplete="orderDateOpen"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="orderDateClose">Дата закрытия договора</Label>
                                <Input type="text" name="orderDateClose" id="orderDateClose"
                                       defaultValue={item.orderDateClose || ''}
                                       onChange={this.handleChange} autoComplete="orderDateClose"/>
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" type="submit">Сохранить</Button>{' '}
                                <Button color="secondary" onClick={() => window.location.reload()}>Назад</Button>
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }
    }
}
export default Order;