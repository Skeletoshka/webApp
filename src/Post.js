import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

class Post extends Component {

    emptyItem = {
        postId:0,
        postName: ''
    };

    constructor(props) {
        super(props);
        this.state = {posts: [], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/post/getlist')
            .then(response => response.json())
            .then(data => this.setState({posts: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/post/delete`, {
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
        const post = await (await fetch(`http://localhost:8090/post/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: post, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;

        await fetch('/post/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/post');
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const item = this.state.item;
        item[name] = value;
        this.setState({item: item});
    };

    render() {
        const {posts, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const postList = posts.map(post => {
                return <tr key={post.postId}>
                    <td style={{whiteSpace: 'nowrap'}}>{post.postName}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" onClick={() => this.change(post.postId)}>Редактировать</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(post.postId)}>Удалить</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            });
            return (
                <div>
                    <AppNavbar/>
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" onClick={()=>this.add()}>Добавить должность</Button>
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
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            let title;
            if(this.state.action === "change") title = <h2>Редактирование информации о должности</h2>;
            if(this.state.action === "add") title = <h2>LjДобавление информации о должности</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="postName">Наименование должности</Label>
                                <Input type="text" name="postName" id="postName" defaultValue={item.postName || ''}
                                       onChange={this.handleChange} autoComplete="postName"/>
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" type="submit">Сохранить</Button>{' '}
                                <Button color="secondary" onClick={()=>window.location.reload()}>Назад</Button>
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }
    }
}
export default Post;