import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class Task extends Component {

    emptyItem = {
        taskId:0,
        projectId:1,
        taskImportance:1,
        taskDateEnd: new Date().toISOString(),
        taskMission: '',
    };

    constructor(props) {
        super(props);
        this.state = {tasks: [], projects:[], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/task/getlist')
            .then(response => response.json())
            .then(data => this.setState({tasks: data}));
        fetch('http://localhost:8090/project/getlist')
            .then(response => response.json())
            .then(data => this.setState({projects: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/task/delete`, {
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
        const worker = await (await fetch(`http://localhost:8090/task/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: worker, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;
        await fetch('http://localhost:8090/task/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/task');
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
        const {tasks, projects, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const taskList = tasks.map(task => {
                return <tr key={task.taskId}>
                    <td style={{whiteSpace: 'nowrap'}}>{task.projectId}</td>
                    <td>{task.taskImportance}</td>
                    <td>{task.taskDateEnd}</td>
                    <td>{task.taskMission}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary"
                                    onClick={() => this.change(task.taskId)}>Редактировать</Button>
                            <Button size="sm" id="delete-button"
                                    onClick={() => this.remove(task.taskId)}>Удалить</Button>
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
                        <h3>Задания</h3>
                        <Table className="mt-4">
                            <thead>
                            <tr>
                                <th width="15%">Номер проекта</th>
                                <th width="15%">Приоритет</th>
                                <th width="30%">Выполнить до:</th>
                                <th width="40%">Задание</th>
                            </tr>
                            </thead>
                            <tbody>
                            {taskList}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            );
        }
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            const projectList = projects.map(project => {
                return <option value = {project.projectId}>{project.projectId}</option>
            })
            const title = <h2>Редактирование информации о Задании</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="projectId">Номер проекта</Label>
                                <select name="projectId" id="projectId" defaultValue={item.projectId || ''}
                                        onChange={this.handleChange} autoComplete="projectId">{projectList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="taskImportance">Приоритет</Label>
                                <Input type="text" name="taskImportance" id="taskImportance"
                                       defaultValue={item.taskImportance || ''}
                                       onChange={this.handleChange} autoComplete="taskImportance"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="taskDateEnd">Выполнить до:</Label>
                                <Input type="text" name="taskDateEnd" id="taskDateEnd"
                                       defaultValue={item.taskDateEnd || ''}
                                       onChange={this.handleChange} autoComplete="taskDateEnd"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="taskMission">Задание</Label>
                                <Input type="text" name="taskMission" id="taskMission"
                                       defaultValue={item.taskMission || ''}
                                       onChange={this.handleChange} autoComplete="taskMission"/>
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
export default Task;