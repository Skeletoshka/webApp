import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

class MoveStatus extends Component {

    emptyItem = {
        moveStatusId:0,
        moveStatusName: ''
    };

    constructor(props) {
        super(props);
        this.state = {moveStatuses: [], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/movestatus/getlist')
            .then(response => response.json())
            .then(data => this.setState({moveStatuses: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/movestatus/delete`, {
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
        const moveStatus = await (await fetch(`http://localhost:8090/movestatus/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: moveStatus, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;

        await fetch('http://localhost:8090/movestatus/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/movestatus');
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
        const {moveStatuses, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const moveStatusList = moveStatuses.map(moveStatus => {
                return <tr key={moveStatus.moveStatusId}>
                    <td style={{whiteSpace: 'nowrap'}}>{moveStatus.moveStatusName}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" onClick={() => this.change(moveStatus.moveStatusId)}>Редактировать</Button>
                            <Button size="sm" id="delete-button" onClick={() => this.remove(moveStatus.moveStatusId)}>Удалить</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            });
            return (
                <div>
                    <AppNavbar/>
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" onClick={()=>this.add()}>Добавить статус движения</Button>
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
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            let title;
            if(this.state.action === "change") title = <h2>Редактирование информации о статусе движения</h2>;
            if(this.state.action === "add") title = <h2>Добавление информации о статусе движения</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="moveStatusName">Наименование статуса движения</Label>
                                <Input type="text" name="moveStatusName" id="moveStatusName" defaultValue={item.moveStatusName || ''}
                                       onChange={this.handleChange} autoComplete="moveStatusName"/>
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
export default MoveStatus;