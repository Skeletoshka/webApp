import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

class ProjectStatus extends Component {

    emptyItem = {
        projectStatusId:0,
        projectStatusName: ''
    };

    constructor(props) {
        super(props);
        this.state = {projectStatuses: [], item: this.emptyItem, action: "get"};
        this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/projectstatus/getlist')
            .then(response => response.json())
            .then(data => this.setState({projectStatuses: data}));
    }

    async remove(id) {
        await fetch(`http://localhost:8090/projectstatus/delete`, {
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
        const projectStatus = await (await fetch(`http://localhost:8090/projectstatus/get`,{method: "POST", body: JSON.stringify(id)})).json();
        this.setState({item: projectStatus, action: "change"});
    }

    async add(){
        this.setState({action: "add"});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let item = this.state.item;

        await fetch('http://localhost:8090/projectstatus/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/projectstatus');
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
        const {projectStatuses, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const projectStatusList = projectStatuses.map(projectStatus => {
                return <tr key={projectStatus.projectStatusId}>
                    <td style={{whiteSpace: 'nowrap'}}>{projectStatus.projectStatusName}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" onClick={() => this.change(projectStatus.projectStatusId)}>Редактировать</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(projectStatus.projectStatusId)}>Удалить</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            });
            return (
                <div>
                    <AppNavbar/>
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" onClick={()=>this.add()}>Добавить статус проекта</Button>
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
        if(this.state.action === "change" || this.state.action === "add"){
            const {item} = this.state;
            let title;
            if(this.state.action === "change") title = <h2>Редактирование информации о статусе проекта</h2>;
            if(this.state.action === "add") title = <h2>Добавление информации о статусе проекта</h2>;
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="projectStatusName">Наименование статуса проекта</Label>
                                <Input type="text" name="projectStatusName" id="projectStatusName" defaultValue={item.projectStatusName || ''}
                                       onChange={this.handleChange} autoComplete="projectStatusName"/>
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
export default ProjectStatus;