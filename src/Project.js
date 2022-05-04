import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class Project extends Component {

    emptyItem = {
        projectId:0,
        orderId:1,
        workerId:1,
        workerLastName: '',
        workerName: '',
        workerMiddleName: '',
        projectStatusId:1,
        projectStatusName: '',
    };

    constructor(props) {
        super(props);
        this.state = {projects: [], workers:[], projectStatuses:[], orders:[], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/project/getlist')
            .then(response => response.json())
            .then(data => this.setState({projects: data}));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => this.setState({workers: data}));
        fetch('http://localhost:8090/projectstatus/getlist')
            .then(response => response.json())
            .then(data => this.setState({projectStatuses: data}));
        fetch('http://localhost:8090/order/getlist')
            .then(response => response.json())
            .then(data => this.setState({orders: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/project/delete`, {
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
        const worker = await (await fetch(`http://localhost:8090/project/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: worker, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;
        await fetch('http://localhost:8090/project/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/project');
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
        const {projects, workers, projectStatuses,orders, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const projectList = projects.map(project => {
                return <tr key={project.projectId}>
                    <td style={{whiteSpace: 'nowrap'}}>{project.orderId}</td>
                    <td>{project.workerLastName} {project.workerName} {project.workerMiddleName}</td>
                    <td>{project.projectStatusName}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary"
                                    onClick={() => this.change(project.projectId)}>Редактировать</Button>
                            <Button size="sm" id="delete-button"
                                    onClick={() => this.remove(project.projectId)}>Удалить</Button>
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
                                <th width="30%">Номер договора</th>
                                <th width="40%">Руководитель проекта</th>
                                <th width="30%">Статус проекта</th>
                            </tr>
                            </thead>
                            <tbody>
                                {projectList}
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
            const projectStatusList = projectStatuses.map(projectStatus => {
                return <option value = {projectStatus.projectStatusId}>{projectStatus.projectStatusName}</option>
            })
            const orderList = orders.map(order => {
                return <option value={order.orderId}>{order.orderId}</option>
            })
            const title = <h2>Редактирование информации о проекте</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="orderId">Номер договора</Label>
                                <select name="orderId" id="orderId" defaultValue={item.orderId || ''}
                                        onChange={this.handleChange} autoComplete="orderId">{orderList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerId">Руководитель проекта</Label>
                                <select name="workerId" id="workerId" defaultValue={item.workerId || ''}
                                        onChange={this.handleChange} autoComplete="workerId">{workerList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="projectStatusId">Статус проекта</Label>
                                <select name="projectStatusId" id="projectStatusId" defaultValue={item.projectStatusId || ''}
                                        onChange={this.handleChange} autoComplete="projectStatusId">{projectStatusList}</select>
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
export default Project;