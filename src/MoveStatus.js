import React, {Component, useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

const emptyItem = {
    moveStatusId:0,
    moveStatusName: ''
};

export default function MoveStatus() {

    const [moveStatuses, setMoveStatuses] = useState();
    const [moveStatusList, setMoveStatusList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/movestatus/getlist')
            .then(response => response.json())
            .then(data => setMoveStatuses(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/movestatus/delete`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });
    }

    async function change(id){
        const moveStatus = await (await fetch(`http://localhost:8090/movestatus/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setAction("change");
        setItem(moveStatus);
    }

    async function add(){
        setAction("add");
    }

    async function handleSubmit() {
        await fetch('http://localhost:8090/movestatus/update', {
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

    const view = () => {
        setMoveStatusList(moveStatuses?.map(moveStatus => {
            return <tr key={moveStatus.moveStatusId}>
                <td style={{whiteSpace: 'nowrap'}}>{moveStatus.moveStatusName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" onClick={() => change(moveStatus.moveStatusId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button" onClick={() => remove(moveStatus.moveStatusId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
    }

    if(action === "get") {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={() => add()}>Добавить статус движения</Button>
                        <Button color="warning" onClick={() => view()}>Обновить</Button>
                    </div>
                    <h3>Статусы движения</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="60%">Наименование статуса движения</th>
                            <th width="40%">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                            {moveStatusList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
    if(action === "change" || action === "add"){
        let title;
        if(action === "change") title = <h2>Редактирование информации о статусе движения</h2>;
        if(action === "add") title = <h2>Добавление информации о статусе движения</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="moveStatusName">Наименование статуса движения</Label>
                            <Input type="text" name="moveStatusName" id="moveStatusName" defaultValue={item.moveStatusName || ''}
                                   onChange={handleChange} autoComplete="moveStatusName"/>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" onClick={() => handleSubmit()}>Сохранить</Button>{' '}
                            <Button color="secondary" onClick={()=>setAction("get")}>Назад</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}