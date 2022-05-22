import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';
import Calendar from "react-calendar";

const emptyItem = {
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

export default function Order(){

    const [workers, setWorkers] = useState();
    const [workerList, setWorkerList] = useState();
    const [orders, setOrders] = useState();
    const [orderList, setOrderList] = useState();
    const [clients, setClients] = useState();
    const [clientList, setClientList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/order/getlist')
            .then(response => response.json())
            .then(data => setOrders(data));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => setWorkers(data));
        fetch('http://localhost:8090/client/getlist')
            .then(response => response.json())
            .then(data => setClients(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/order/delete`, {
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
        const order = await (await fetch(`http://localhost:8090/order/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setItem(order);
        setAction("change");
    }

    async function add(){
        setAction("add")
    }

    async function handleSubmit() {
        await fetch('http://localhost:8090/order/update', {
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

    function handleOrderOpenChange(value){
        let item1 = item;
        item1["orderDateOpen"] = value
        setItem(item1)
    }

    function handleOrderCloseChange(value){
        let item1 = item;
        item1["orderDateClose"] = value
        setItem(item1)
    }

    function view(){
        setOrderList(orders?.map(order => {
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
                                onClick={() => change(order.orderId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button"
                                onClick={() => remove(order.orderId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
        setWorkerList(workers?.map(worker => {
            return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
        }));
        setClientList(clients?.map(client => {
            return <option value = {client.clientId}>{client.clientCompanyName}</option>
        }));
    }

    if(action === "get" || action === "delete") {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={()=>add()}>Добавить заказ</Button>
                        <Button color="warning" onClick={()=>view()}>Обновить</Button>
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
    if(action === "change" || action === "add"){
        const title = <h2>Редактирование информации о заказе</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="clientId">Наименование компании</Label>
                            <select name="clientId" id="clientId" defaultValue={item.clientId || ''}
                                    onChange={handleChange} autoComplete="clientId">{clientList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderTermsContract">Термины договора</Label>
                            <Input type="text" name="orderTermsContract" id="orderTermsContract"
                                   defaultValue={item.orderTermsContract || ''}
                                   onChange={handleChange} autoComplete="orderTermsContract"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderObligationCustomer">Обязательства заказчика</Label>
                            <Input type="text" name="orderObligationCustomer" id="orderObligationCustomer"
                                   defaultValue={item.orderObligationCustomer || ''}
                                   onChange={handleChange} autoComplete="orderObligationCustomer"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderObligationContractor">Обязательства исполнителя</Label>
                            <Input type="text" name="orderObligationContractor" id="orderObligationContractor"
                                   defaultValue={item.orderObligationContractor || ''}
                                   onChange={handleChange} autoComplete="orderObligationContractor"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderRegulatoryDocument">Нормативные документы</Label>
                            <Input type="text" name="orderRegulatoryDocument" id="orderRegulatoryDocument"
                                   defaultValue={item.orderRegulatoryDocument || ''}
                                   onChange={handleChange} autoComplete="orderRegulatoryDocument"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="workerId">Ответственный сотрудник</Label>
                            <select name="workerId" id="workerId" defaultValue={item.workerId || ''}
                                    onChange={handleChange} autoComplete="workerId">{workerList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderDateOpen">Дата открытия договора</Label>
                            <Calendar value={new Date(new Date(item.orderDateOpen).getTime())} onChange={handleOrderOpenChange} returnValue={"start"}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderDateClose">Дата закрытия договора</Label>
                            <Calendar value={new Date(new Date(item.orderDateClose).getTime())} onChange={handleOrderCloseChange} returnValue={"start"}/>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" onClick={() => handleSubmit()}>Сохранить</Button>{' '}
                            <Button color="secondary" onClick={() => setAction("get")}>Назад</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}