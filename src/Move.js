import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';
import Calendar from "react-calendar";

const emptyItem = {
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

export default function Move(){

    const [workers, setWorkers] = useState();
    const [workerList, setWorkerList] = useState();
    const [tasks, setTasks] = useState();
    const [taskList, setTaskList] = useState();
    const [moves, setMoves] = useState();
    const [moveList, setMoveList] = useState();
    const [moveStatuses, setMoveStatuses] = useState();
    const [moveStatusList, setMoveStatusList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
            fetch('http://localhost:8090/move/getlist')
                .then(response => response.json())
                .then(data => setMoves(data));
            fetch('http://localhost:8090/worker/getlist')
                .then(response => response.json())
                .then(data => setWorkers(data));
            fetch('http://localhost:8090/movestatus/getlist')
                .then(response => response.json())
                .then(data => setMoveStatuses(data));
            fetch('http://localhost:8090/task/getlist')
                .then(response => response.json())
                .then(data => setTasks(data));
        }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/move/delete`, {
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
        const move = await (await fetch(`http://localhost:8090/move/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setItem(move);
        setAction("change");
    }

    async function add(){
        setAction("add")
    }

    async function handleSubmit(){
        await fetch('http://localhost:8090/move/update', {
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

    function handleDateStartChange(value){
        let item1 = item;
        item1["moveDateStart"] = value
        setItem(item1)
    }

    function handleDateEndChange(value){
        let item1 = item;
        item1["moveDateEnd"] = value
        setItem(item1)
    }

    function view() {
        setMoveList(moves?.map(move => {
            return <tr key={move.moveId}>
                <td style={{whiteSpace: 'nowrap'}}>{move.taskMission}</td>
                <td>{move.senderLastName} {move.senderName} {move.senderMiddleName}</td>
                <td>{move.recipientLastName} {move.recipientName} {move.recipientMiddleName}</td>
                <td>{move.moveStatusName}</td>
                <td>{new Date(move.moveDateStart).toLocaleDateString()}</td>
                <td>{new Date(move.moveDateEnd).toLocaleDateString()}</td>
                <td>{move.moveDesc}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary"
                                onClick={() => change(move.moveId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button"
                                onClick={() => remove(move.moveId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
        setTaskList(tasks?.map(task => {
            return <option value = {task.taskId}>{task.taskMission}</option>
        }));
        setWorkerList(workers?.map(worker => {
            return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
        }));
        setMoveStatusList(moveStatuses?.map(moveStatus => {
            return <option value = {moveStatus.moveStatusId}>{moveStatus.moveStatusName}</option>
        }));
    }

    if(action === "get" || action === "delete") {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={()=>add()}>Добавить движение</Button>
                        <Button color="warning" onClick={()=>view()}>Обновить</Button>
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
                            <th width="10%">Дата конца</th>
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
    if(action === "change" || action === "add"){
        const title = <h2>Редактирование информации о Движении</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="taskId">Задание</Label>
                            <select name="taskId" id="taskId" defaultValue={item.taskId || ''}
                                    onChange={handleChange} autoComplete="taskId">{taskList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="senderId">Отправитель</Label>
                            <select name="senderId" id="senderId" defaultValue={item.senderId || ''}
                                    onChange={handleChange} autoComplete="senderId">{workerList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="recipientId">Получатель</Label>
                            <select name="recipientId" id="recipientId" defaultValue={item.recipientId || ''}
                                    onChange={handleChange} autoComplete="recipientId">{workerList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="moveStatusId">Статус</Label>
                            <select name="moveStatusId" id="moveStatusId" defaultValue={item.moveStatusId || ''}
                                    onChange={handleChange} autoComplete="moveStatusId">{moveStatusList}</select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="moveDateStart">Дата начала</Label>
                            <Calendar value={new Date(new Date(item.moveDateStart).getTime())} onChange={handleDateStartChange} returnValue={"start"}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="moveDateEnd">Дата конца</Label>
                            <Calendar value={new Date(new Date(item.moveDateEnd).getTime())} onChange={handleDateEndChange} returnValue={"start"}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="moveDesc">Описание</Label>
                            <Input type="text" name="moveDesc" id="moveDesc"
                                   defaultValue={item.moveDesc || ''}
                                   onChange={handleChange} autoComplete="moveDesc"/>
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