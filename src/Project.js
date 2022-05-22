import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

const emptyItem = {
    projectId:0,
    orderId:1,
    workerId:1,
    workerLastName: '',
    workerName: '',
    workerMiddleName: '',
    projectStatusId:1,
    projectStatusName: '',
};

export default function Project(){

    const [workers, setWorkers] = useState();
    const [workerList, setWorkerList] = useState();
    const [projects, setProjects] = useState();
    const [projectList, setProjectList] = useState();
    const [projectStatuses, setProjectsStatuses] = useState();
    const [projectStatusList, setProjectStatusList] = useState();
    const [orders, setOrders] = useState();
    const [orderList, setOrderList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/project/getlist')
            .then(response => response.json())
            .then(data => setProjects(data));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => setWorkers(data));
        fetch('http://localhost:8090/projectstatus/getlist')
            .then(response => response.json())
            .then(data => setProjectsStatuses(data));
        fetch('http://localhost:8090/order/getlist')
            .then(response => response.json())
            .then(data => setOrders(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/project/delete`, {
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
        const worker = await (await fetch(`http://localhost:8090/project/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setItem(worker);
        setAction("change");
    }

    async function add(){
        setAction("add")
    }

    async function handleSubmit() {
        await fetch('http://localhost:8090/project/update', {
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
        setProjectList(projects?.map(project => {
            return <tr key={project.projectId}>
                <td style={{whiteSpace: 'nowrap'}}>{project.orderId}</td>
                <td>{project.workerLastName} {project.workerName} {project.workerMiddleName}</td>
                <td>{project.projectStatusName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary"
                                onClick={() => change(project.projectId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button"
                                onClick={() => remove(project.projectId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
        setWorkerList(workers?.map(worker => {
            return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
        }));
        setProjectStatusList(projectStatuses?.map(projectStatus => {
            return <option value = {projectStatus.projectStatusId}>{projectStatus.projectStatusName}</option>
        }));
        setOrderList(orders?.map(order => {
            return <option value={order.orderId}>{order.orderId}</option>
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
                    <h3>Проекты</h3>
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
    if(action === "change" || action === "add"){
        const title = <h2>Редактирование информации о проекте</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="orderId">Номер договора</Label>
                            <select name="orderId" id="orderId" defaultValue={item.orderId || ''}
                                    onChange={handleChange} autoComplete="orderId">{orderList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="workerId">Руководитель проекта</Label>
                            <select name="workerId" id="workerId" defaultValue={item.workerId || ''}
                                    onChange={handleChange} autoComplete="workerId">{workerList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="projectStatusId">Статус проекта</Label>
                            <select name="projectStatusId" id="projectStatusId" defaultValue={item.projectStatusId || ''}
                                    onChange={handleChange} autoComplete="projectStatusId">{projectStatusList}</select>
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