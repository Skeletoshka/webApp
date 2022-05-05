import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class Move extends Component {

    emptyItem = {
        moveId:0,
        taskId:1,
        taskMission: '',
        senderId:1,
        senderLastName: '',
        senderName: '',
        senderMiddleName: '',
        recipientId:1,
        recipientLastName: '',
        recipientName: '',
        recipientMiddleName: '',
        moveStatusId:1,
        moveStatusName: '',
        moveDateStart: new Date().toISOString(),
        moveDateEnd: new Date().toISOString(),
        moveDesc: '',
    };

    constructor(props) {
        super(props);
        this.state = {moves: [], workers:[], moveStatuses:[], tasks:[], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/move/getlist')
            .then(response => response.json())
            .then(data => this.setState({moves: data}));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => this.setState({workers: data}));
        fetch('http://localhost:8090/movestatus/getlist')
            .then(response => response.json())
            .then(data => this.setState({moveStatuses: data}));
        fetch('http://localhost:8090/task/getlist')
            .then(response => response.json())
            .then(data => this.setState({tasks: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/move/delete`, {
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
        const move = await (await fetch(`http://localhost:8090/move/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: move, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;
        await fetch('http://localhost:8090/move/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/move');
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
        const {moves, workers, moveStatuses, tasks, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const moveList = moves.map(move => {
                return <tr key={move.moveId}>
                    <td style={{whiteSpace: 'nowrap'}}>{move.taskMission}</td>
                    <td>{move.senderLastName} {move.senderName} {move.senderMiddleName}</td>
                    <td>{move.recipientLastName} {move.recipientName} {move.recipientMiddleName}</td>
                    <td>{move.moveStatusName}</td>
                    <td>{move.moveDateStart}</td>
                    <td>{move.moveDateEnd}</td>
                    <td>{move.moveDesc}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary"
                                    onClick={() => this.change(move.moveId)}>Редактировать</Button>
                            <Button size="sm" id="delete-button"
                                    onClick={() => this.remove(move.moveId)}>Удалить</Button>
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
                        <h3>Движения</h3>
                        <Table className="mt-4">
                            <thead>
                            <tr>
                                <th width="15%">Задание</th>
                                <th width="20%">Отправитель</th>
                                <th width="20%">Получатель</th>
                                <th width="10%">Статус</th>
                                <th width="10%">Дата начала</th>
                                <th width="10%">Дата начала</th>
                                <th width="40%">Описание</th>
                            </tr>
                            </thead>
                            <tbody>
                            {moveList}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            );
        }
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            const taskList = tasks.map(task => {
                return <option value = {task.taskId}>{task.taskMission}</option>
            })
            const workerList = workers.map(worker => {
                return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
            })
            const moveStatusList = moveStatuses.map(moveStatus => {
                return <option value = {moveStatus.moveStatusId}>{moveStatus.moveStatusName}</option>
            })
            const title = <h2>Редактирование информации о Движении</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="taskId">Задание</Label>
                                <select name="taskId" id="taskId" defaultValue={item.taskId || ''}
                                        onChange={this.handleChange} autoComplete="taskId">{taskList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="senderId">Отправитель</Label>
                                <select name="senderId" id="senderId" defaultValue={item.senderId || ''}
                                        onChange={this.handleChange} autoComplete="senderId">{workerList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="recipientId">Получатель</Label>
                                <select name="recipientId" id="recipientId" defaultValue={item.recipientId || ''}
                                        onChange={this.handleChange} autoComplete="recipientId">{workerList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="moveStatusId">Статус</Label>
                                <select name="moveStatusId" id="moveStatusId" defaultValue={item.moveStatusId || ''}
                                        onChange={this.handleChange} autoComplete="moveStatusId">{moveStatusList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="moveDateStart">Дата начала</Label>
                                <Input type="text" name="moveDateStart" id="moveDateStart"
                                       defaultValue={item.moveDateStart || ''}
                                       onChange={this.handleChange} autoComplete="moveDateStart"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="moveDateEnd">Дата конца</Label>
                                <Input type="text" name="moveDateEnd" id="moveDateEnd"
                                       defaultValue={item.moveDateEnd || ''}
                                       onChange={this.handleChange} autoComplete="moveDateEnd"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="moveDesc">Описание</Label>
                                <Input type="text" name="moveDesc" id="moveDesc"
                                       defaultValue={item.moveDesc || ''}
                                       onChange={this.handleChange} autoComplete="moveDesc"/>
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
export default Move;