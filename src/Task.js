import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';
import Calendar from "react-calendar";

const emptyItem = {
    taskId:0,
    projectId:1,
    taskImportance:1,
    taskDateEnd: new Date().toISOString(),
    taskMission: '',
};

export default function Task(){

    const [tasks, setTasks] = useState();
    const [taskList, setTaskList] = useState();
    const [projects, setProjects] = useState();
    const [projectList, setProjectList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/task/getlist')
            .then(response => response.json())
            .then(data => setTasks(data));
        fetch('http://localhost:8090/project/getlist')
            .then(response => response.json())
            .then(data => setProjects(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/task/delete`, {
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
        const worker = await (await fetch(`http://localhost:8090/task/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setItem(worker);
        setAction("change");
    }

    async function add(){
        setAction("add");
    }

    async function handleSubmit() {
        await fetch('http://localhost:8090/task/update', {
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

    function handleDateEndChange(value){
        let item1 = item;
        item1["taskDateEnd"] = value
        setItem(item1)
    }

    function view(){
        setTaskList(tasks?.map(task => {
            return <tr key={task.taskId}>
                <td style={{whiteSpace: 'nowrap'}}>{task.projectId}</td>
                <td>{task.taskImportance}</td>
                <td>{new Date(new Date(task.taskDateEnd).getTime()).toLocaleDateString()}</td>
                <td>{task.taskMission}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary"
                                onClick={() => change(task.taskId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button"
                                onClick={() => remove(task.taskId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
        setProjectList(projects?.map(project => {
            return <option value={project.projectId}>{project.projectId}</option>
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
    if(action === "change" || action === "add") {
        const title = <h2>Редактирование информации о Задании</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="projectId">Номер проекта</Label>
                            <select name="projectId" id="projectId" defaultValue={item.projectId || ''}
                                    onChange={handleChange} autoComplete="projectId">{projectList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="taskImportance">Приоритет</Label>
                            <Input type="text" name="taskImportance" id="taskImportance"
                                   defaultValue={item.taskImportance || ''}
                                   onChange={handleChange} autoComplete="taskImportance"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="taskDateEnd">Выполнить до:</Label>
                            <Calendar value={new Date(new Date(item.taskDateEnd).getTime())} onChange={handleDateEndChange} returnValue={"start"}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="taskMission">Задание</Label>
                            <Input type="text" name="taskMission" id="taskMission"
                                   defaultValue={item.taskMission || ''}
                                   onChange={handleChange} autoComplete="taskMission"/>
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