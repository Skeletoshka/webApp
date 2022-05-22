import React, {Component, useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

const emptyItem = {
    projectStatusId:0,
    projectStatusName: ''
};

export default function ProjectStatus() {

    const [projectStatuses, setProjectStatuses] = useState();
    const [projectStatusList, setProjectStatusList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(()=> {
        fetch('http://localhost:8090/projectstatus/getlist')
            .then(response => response.json())
            .then(data => setProjectStatuses(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/projectstatus/delete`, {
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
        const projectStatus = await (await fetch(`http://localhost:8090/projectstatus/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setAction("change");
        setItem(projectStatus);
    }

    async function add(){
        setAction("add");
    }

    async function handleSubmit() {
        await fetch('http://localhost:8090/projectstatus/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
    }

    const view = () => {
        setProjectStatusList(projectStatuses?.map(projectStatus => {
            return <tr key={projectStatus.projectStatusId}>
                <td style={{whiteSpace: 'nowrap'}}>{projectStatus.projectStatusName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" onClick={() => change(projectStatus.projectStatusId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button" onClick={() => remove(projectStatus.projectStatusId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item1 = item;
        item1[name] = value;
        setItem(item1);
    }

    if(action === "get" || action === "delete") {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={()=>add()}>Добавить статус проекта</Button>
                        <Button color="warning" onClick={()=>view()}>Обновить</Button>
                    </div>
                    <h3>Статусы проекта</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="60%">Наименование статуса проекта</th>
                            <th width="40%">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                            {projectStatusList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
    if(action === "change" || action === "add"){
        let title;
        if(action === "change") title = <h2>Редактирование информации о статусе проекта</h2>;
        if(action === "add") title = <h2>Добавление информации о статусе проекта</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="projectStatusName">Наименование статуса проекта</Label>
                            <Input type="text" name="projectStatusName" id="projectStatusName" defaultValue={item.projectStatusName || ''}
                                   onChange={handleChange} autoComplete="projectStatusName"/>
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