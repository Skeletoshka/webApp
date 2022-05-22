import React, {Component, useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

const emptyItem = {
    companyId:0,
    workerLastName: '',
    workerName: '',
    workerMiddleName: '',
    companyName: '',
    companyLegalCity: '',
    companyLegalStreet: '',
    companyLegalHouse: '',
    companyFactCity: '',
    companyFactStreet: '',
    companyFactHouse: '',
    companyPhoneNumber: '',
};

export default function Company(){

    const [workers, setWorkers] = useState();
    const [workerList, setWorkerList] = useState();
    const [companies, setCompanies] = useState();
    const [companyList, setCompanyList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/company/getlist')
            .then(response => response.json())
            .then(data => setCompanies(data));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => setWorkers(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/company/delete`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });
        setAction("delete")
    }

    async function change(id){
        const company = await (await fetch(`http://localhost:8090/company/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setItem(company);
        setAction("change");
    }

    async function add(){
        setAction("add");
    }

    async function handleSubmit(event) {
        await fetch('http://localhost:8090/company/update', {
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
        setCompanyList(companies.map(company => {
            return <tr key={company.companyId}>
                <td style={{whiteSpace: 'nowrap'}}>{company.companyName}</td>
                <td>{company.companyLegalCity}, {company.companyLegalStreet} {company.companyLegalHouse}</td>
                <td>{company.companyFactCity}, {company.companyFactStreet} {company.companyFactHouse}</td>
                <td>{company.workerLastName} {company.workerName} {company.workerMiddleName}</td>
                <td>{company.companyPhoneNumber}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary"
                                onClick={() => change(company.companyId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button"
                                onClick={() => remove(company.companyId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
        setWorkerList(workers.map(worker => {
            return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
        }));
    }

    if(action === "get" || action === "delete") {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={()=>add()}>Добавить компанию</Button>
                        <Button color="warning" onClick={()=>view()}>Обновить</Button>
                    </div>
                    <h3>Компании</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="15%">Имя компании</th>
                            <th width="25%">Юридический адрес</th>
                            <th width="25%">Фактический адрес</th>
                            <th width="20%">ФИО директора</th>
                            <th width="15%">Номер телефона компании</th>
                        </tr>
                        </thead>
                        <tbody>
                            {companyList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
    if(action === "change" || action === "add"){
        const title = <h2>Редактирование информации о компании</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="companyName">Наимнование компании</Label>
                            <Input type="text" name="companyName" id="companyName"
                                   defaultValue={item.companyName || ''}
                                   onChange={handleChange} autoComplete="companyName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="companyLegalCity">Юридический город компании</Label>
                            <Input type="text" name="companyLegalCity" id="companyLegalCity"
                                   defaultValue={item.companyLegalCity || ''}
                                   onChange={handleChange} autoComplete="companyLegalCity"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="companyLegalStreet">Юридическя улица компании</Label>
                            <Input type="text" name="companyLegalStreet" id="companyLegalStreet"
                                   defaultValue={item.companyLegalStreet || ''}
                                   onChange={handleChange} autoComplete="companyLegalStreet"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="companyLegalHouse">Юридический дом компании</Label>
                            <Input type="text" name="companyLegalHouse" id="companyLegalHouse"
                                   defaultValue={item.companyLegalHouse || ''}
                                   onChange={handleChange} autoComplete="companyLegalHouse"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="companyFactCity">Фактический город компании</Label>
                            <Input type="text" name="companyFactCity" id="companyFactCity"
                                   defaultValue={item.companyFactCity || ''}
                                   onChange={handleChange} autoComplete="companyFactCity"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="companyFactStreet">Фактическая улица компании</Label>
                            <Input type="text" name="companyFactStreet" id="companyFactStreet"
                                   defaultValue={item.companyFactStreet || ''}
                                   onChange={handleChange} autoComplete="companyFactStreet"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="companyFactHouse">Фактический дом компании</Label>
                            <Input type="text" name="companyFactHouse" id="companyFactHouse"
                                   defaultValue={item.companyFactHouse || ''}
                                   onChange={handleChange} autoComplete="companyFactHouse"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="workerId">Директор</Label>
                            <select name="workerId" id="workerId" defaultValue={item.workerId || ''}
                                    onChange={handleChange} autoComplete="workerId">{workerList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="companyPhoneNumber">Телефон компании</Label>
                            <Input type="text" name="companyPhoneNumber" id="companyPhoneNumber"
                                   defaultValue={item.companyPhoneNumber || ''}
                                   onChange={handleChange} autoComplete="companyPhoneNumber"/>
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