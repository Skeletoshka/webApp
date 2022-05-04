import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class Worker extends Component {

    emptyItem = {
        workerId:0,
        workerLastName: '',
        workerName: '',
        workerMiddleName: '',
        workerSalary: 0,
        postId: 0,
        postName: '',
        workerBirthday: new Date().toISOString(),
        workerDateStartJob: new Date().toISOString(),
        workerDateEndJob: new Date().toISOString(),
        workerPassword: '',
    };

    constructor(props) {
        super(props);
        this.state = {workers: [], posts:[], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => this.setState({workers: data}));
        fetch('http://localhost:8090/post/getlist')
            .then(response => response.json())
            .then(data => this.setState({posts: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/worker/delete`, {
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
        const worker = await (await fetch(`http://localhost:8090/worker/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: worker, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;
        new Date(item.workerBirthday).setDate(new Date(item.workerBirthday).getDate());
        new Date(item.workerDateStartJob).setDate(new Date(item.workerDateStartJob).getDate());
        if (item.workerDateEndJob != null) new Date(item.workerDateEndJob).setDate(new Date(item.workerDateEndJob).getDate());

        await fetch('http://localhost:8090/worker/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/worker');
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item = this.state.item;
        item[name] = value;
        this.setState({item: item});
    };

    dateChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item = this.state.item;
        item[name] = value.valueOf();
        this.setState({item: item});
    }

    postChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item = this.state.item;
        item[name] = value;
        this.setState({item: item});
    }

    //todo Реализовать календарь для выбора дат

    render() {
        const {workers, posts, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const workerList = workers.map(worker => {
                if (worker.workerDateEndJob === null){
                    return <tr key={worker.workerId}>
                        <td style={{whiteSpace: 'nowrap'}}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</td>
                        <td>{worker.workerSalary}</td>
                        <td>{worker.postName}</td>
                        <td>{new Date(worker.workerBirthday).getDate()}.{new Date(worker.workerBirthday).getMonth()}.{new Date(worker.workerBirthday).getFullYear()}</td>
                        <td>{new Date(worker.workerDateStartJob).getDate()}.{new Date(worker.workerDateStartJob).getMonth()}.{new Date(worker.workerDateStartJob).getFullYear()}</td>
                        <td></td>
                        <td>{worker.workerPassword}</td>
                        <td>
                            <ButtonGroup>
                                <Button size="sm" color="primary"
                                        onClick={() => this.change(worker.workerId)}>Редактировать</Button>
                                <Button size="sm" id="delete-button"
                                        onClick={() => this.remove(worker.workerId)}>Удалить</Button>
                            </ButtonGroup>
                        </td>
                    </tr>
                }else {
                    return <tr key={worker.workerId}>
                        <td style={{whiteSpace: 'nowrap'}}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</td>
                        <td>{worker.workerSalary}</td>
                        <td>{worker.postName}</td>
                        <td>{new Date(worker.workerBirthday).getDate()}.{new Date(worker.workerBirthday).getMonth()}.{new Date(worker.workerBirthday).getFullYear()}</td>
                        <td>{new Date(worker.workerDateStartJob).getDate()}.{new Date(worker.workerDateStartJob).getMonth()}.{new Date(worker.workerDateStartJob).getFullYear()}</td>
                        <td>{new Date(worker.workerDateEndJob).getDate()}.{new Date(worker.workerDateEndJob).getMonth()}.{new Date(worker.workerDateEndJob).getFullYear()}</td>
                        <td>{worker.workerPassword}</td>
                        <td>
                            <ButtonGroup>
                                <Button size="sm" color="primary"
                                        onClick={() => this.change(worker.workerId)}>Редактировать</Button>
                                <Button size="sm" id="delete-button"
                                        onClick={() => this.remove(worker.workerId)}>Удалить</Button>
                            </ButtonGroup>
                        </td>
                    </tr>
                }
            });
            return (
                <div>
                    <AppNavbar/>
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" onClick={()=>this.add()}>Добавить сотрудника</Button>
                        </div>
                        <h3>Сотрудники</h3>
                        <Table className="mt-4">
                            <thead>
                            <tr>
                                <th width="15%">ФИО сотрудника</th>
                                <th width="15%">Заработная плата сотрудника</th>
                                <th width="15%">Наименование должности</th>
                                <th width="15%">Дата рождения сотрудника</th>
                                <th width="15%">Дата начала работы в компании</th>
                                <th width="15%">Дата окончания работы в компании</th>
                                <th width="50%">Пароль сотрудника</th>
                            </tr>
                            </thead>
                            <tbody>
                                {workerList}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            );
        }
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            const postList = posts.map(post => {
                return <option value = {post.postId}>{post.postName}</option>
            })
            const title = <h2>Редактирование информации о сотруднике</h2>;
            if(item.workerDateEndJob != null)
            {
                return (
                    <div>
                        <AppNavbar/>
                        <Container>
                            {title}
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label for="workerLastName">Фамилия сотрудника</Label>
                                    <Input type="text" name="workerLastName" id="workerLastName"
                                           defaultValue={item.workerLastName || ''}
                                           onChange={this.handleChange} autoComplete="workerLastName"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerName">Имя сотрудника</Label>
                                    <Input type="text" name="workerName" id="workerName"
                                           defaultValue={item.workerName || ''}
                                           onChange={this.handleChange} autoComplete="workerName"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerMiddleName">Отчество сотрудника</Label>
                                    <Input type="text" name="workerMiddleName" id="workerMiddleName"
                                           defaultValue={item.workerMiddleName || ''}
                                           onChange={this.handleChange} autoComplete="workerMiddleName"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerSalary">Заработная плата сотрудника</Label>
                                    <Input type="text" name="workerSalary" id="workerSalary"
                                           defaultValue={item.workerSalary || ''}
                                           onChange={this.handleChange} autoComplete="workerSalary"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="postId">Наименование должности</Label>
                                    <select name="postId" id="postId" defaultValue={item.postId || ''}
                                            onChange={this.handleChange} autoComplete="postId">{postList}</select>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerBirthday">Дата рождения сотрудника</Label>
                                    <Input type="text" name="workerBirthday" id="workerBirthday"
                                           defaultValue={item.workerBirthday || ''}
                                           onChange={this.handleChange} autoComplete="workerBirthday"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerDateStartJob">Дата начала работы в компании</Label>
                                    <Input type="text" name="workerDateStartJob" id="workerDateStartJob"
                                           defaultValue={item.workerDateStartJob || ''}
                                           onChange={this.handleChange} autoComplete="workerDateStartJob"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerDateEndJob">Дата окончания работы в компании</Label>
                                    <Input type="text" name="workerDateEndJob" id="workerDateEndJob"
                                           defaultValue={item.workerDateEndJob || ''}
                                           onChange={this.handleChange} autoComplete="workerDateEndJob"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerPassword">Пароль сотрудника</Label>
                                    <Input type="text" name="workerPassword" id="workerPassword"
                                           defaultValue={item.workerPassword || ''}
                                           onChange={this.handleChange} autoComplete="workerPassword"/>
                                </FormGroup>
                                <FormGroup>
                                    <Button color="primary" type="submit">Сохранить</Button>{' '}
                                    <Button color="secondary" onClick={() => window.location.reload()}>Назад</Button>
                                </FormGroup>
                            </Form>
                        </Container>
                    </div>
                );
            }else{
                return (
                    <div>
                        <AppNavbar/>
                        <Container>
                            {title}
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label for="workerLastName">Фамилия сотрудника</Label>
                                    <Input type="text" name="workerLastName" id="workerLastName"
                                           defaultValue={item.workerLastName || ''}
                                           onChange={this.handleChange} autoComplete="workerLastName"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerName">Имя сотрудника</Label>
                                    <Input type="text" name="workerName" id="workerName"
                                           defaultValue={item.workerName || ''}
                                           onChange={this.handleChange} autoComplete="workerName"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerMiddleName">Отчество сотрудника</Label>
                                    <Input type="text" name="workerMiddleName" id="workerMiddleName"
                                           defaultValue={item.workerMiddleName || ''}
                                           onChange={this.handleChange} autoComplete="workerMiddleName"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerSalary">Заработная плата сотрудника</Label>
                                    <Input type="text" name="workerSalary" id="workerSalary"
                                           defaultValue={item.workerSalary || ''}
                                           onChange={this.handleChange} autoComplete="workerSalary"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="postId">Наименование должности</Label>
                                    <select name="postId" id="postId" defaultValue={item.postId || ''}
                                            onChange={this.handleChange} autoComplete="postId">{postList}</select>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerBirthday">Дата рождения сотрудника</Label>
                                    <Input type="text" name="workerBirthday" id="workerBirthday"
                                           defaultValue={item.workerBirthday || ''}
                                           onChange={this.handleChange} autoComplete="workerBirthday"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerDateStartJob">Дата начала работы в компании</Label>
                                    <Input type="text" name="workerDateStartJob" id="workerDateStartJob"
                                           defaultValue={item.workerDateStartJob || ''}
                                           onChange={this.handleChange} autoComplete="workerDateStartJob"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerDateEndJob">Дата окончания работы в компании</Label>
                                    <Input type="text" name="workerDateEndJob" id="workerDateEndJob"
                                           defaultValue={''}
                                           onChange={this.handleChange} autoComplete="workerDateEndJob"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workerPassword">Пароль сотрудника</Label>
                                    <Input type="text" name="workerPassword" id="workerPassword"
                                           defaultValue={item.workerPassword || ''}
                                           onChange={this.handleChange} autoComplete="workerPassword"/>
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
}
export default Worker;