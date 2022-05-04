import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class Company extends Component {

    emptyItem = {
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

    constructor(props) {
        super(props);
        this.state = {companies: [], workers:[], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/company/getlist')
            .then(response => response.json())
            .then(data => this.setState({companies: data}));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => this.setState({workers: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/company/delete`, {
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
        const company = await (await fetch(`http://localhost:8090/company/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: company, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;
        await fetch('http://localhost:8090/company/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/company');
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

    render() {
        const {companies, workers, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const companyList = companies.map(company => {
                return <tr key={company.companyId}>
                    <td style={{whiteSpace: 'nowrap'}}>{company.companyName}</td>
                    <td>{company.companyLegalCity}, {company.companyLegalStreet} {company.companyLegalHouse}</td>
                    <td>{company.companyFactCity}, {company.companyFactStreet} {company.companyFactHouse}</td>
                    <td>{company.workerLastName} {company.workerName} {company.workerMiddleName}</td>
                    <td>{company.companyPhoneNumber}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary"
                                    onClick={() => this.change(company.companyId)}>Редактировать</Button>
                            <Button size="sm" id="delete-button"
                                    onClick={() => this.remove(company.companyId)}>Удалить</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            });
            return (
                <div>
                    <AppNavbar/>
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" onClick={()=>this.add()}>Добавить компанию</Button>
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
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            const workerList = workers.map(worker => {
                return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
            })
            const title = <h2>Редактирование информации о компании</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="companyName">Наимнование компании</Label>
                                <Input type="text" name="companyName" id="companyName"
                                       defaultValue={item.companyName || ''}
                                       onChange={this.handleChange} autoComplete="companyName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="companyLegalCity">Юридический город компании</Label>
                                <Input type="text" name="companyLegalCity" id="companyLegalCity"
                                       defaultValue={item.companyLegalCity || ''}
                                       onChange={this.handleChange} autoComplete="companyLegalCity"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="companyLegalStreet">Юридическя улица компании</Label>
                                <Input type="text" name="companyLegalStreet" id="companyLegalStreet"
                                       defaultValue={item.companyLegalStreet || ''}
                                       onChange={this.handleChange} autoComplete="companyLegalStreet"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="companyLegalHouse">Юридический дом компании</Label>
                                <Input type="text" name="companyLegalHouse" id="companyLegalHouse"
                                       defaultValue={item.companyLegalHouse || ''}
                                       onChange={this.handleChange} autoComplete="companyLegalHouse"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="companyFactCity">Фактический город компании</Label>
                                <Input type="text" name="companyFactCity" id="companyFactCity"
                                       defaultValue={item.companyFactCity || ''}
                                       onChange={this.handleChange} autoComplete="companyFactCity"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="companyFactStreet">Фактическая улица компании</Label>
                                <Input type="text" name="companyFactStreet" id="companyFactStreet"
                                       defaultValue={item.companyFactStreet || ''}
                                       onChange={this.handleChange} autoComplete="companyFactStreet"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="companyFactHouse">Фактический дом компании</Label>
                                <Input type="text" name="companyFactHouse" id="companyFactHouse"
                                       defaultValue={item.companyFactHouse || ''}
                                       onChange={this.handleChange} autoComplete="companyFactHouse"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerId">Директор</Label>
                                <select name="workerId" id="workerId" defaultValue={item.workerId || ''}
                                        onChange={this.handleChange} autoComplete="workerId">{workerList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="companyPhoneNumber">Телефон компании</Label>
                                <Input type="text" name="companyPhoneNumber" id="companyPhoneNumber"
                                       defaultValue={item.companyPhoneNumber || ''}
                                       onChange={this.handleChange} autoComplete="companyPhoneNumber"/>
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
export default Company;