import React, {Component, useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

const emptyItem = {
    postId:0,
    postName: ''
};

export default function Post(){

    const [posts, setPosts] = useState();
    const [postList, setPostList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/post/getlist')
            .then(response => response.json())
            .then(data => setPosts(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/post/delete`, {
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
        const post = await (await fetch(`http://localhost:8090/post/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setItem(post);
        setAction("change")
    }

    async function add(){
        setAction("add")
    }

    async function handleSubmit() {
        await fetch('http://localhost:8090/post/update', {
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
        setItem(item1)
    }

    function view(){
        setPostList(posts?.map(post => {
            return <tr key={post.postId}>
                <td style={{whiteSpace: 'nowrap'}}>{post.postName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" onClick={() => change(post.postId)}>Редактировать</Button>
                        <Button size="sm" id="delete-button" onClick={() => remove(post.postId)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }));
    }

    if(action === "get" || action === "delete") {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={()=>add()}>Добавить должность</Button>
                        <Button color="warning" onClick={() => view()}>Обновить</Button>
                    </div>
                    <h3>Должности</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="60%">Наименование должности</th>
                            <th width="40%">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                            {postList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
    if(action === "change" || action === "add"){
        let title;
        if(action === "change") title = <h2>Редактирование информации о должности</h2>;
        if(action === "add") title = <h2>LjДобавление информации о должности</h2>;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    {title}
                    <Form>
                        <FormGroup>
                            <Label for="postName">Наименование должности</Label>
                            <Input type="text" name="postName" id="postName" defaultValue={item.postName || ''}
                                   onChange={handleChange} autoComplete="postName"/>
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