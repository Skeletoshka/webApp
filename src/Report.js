import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {orders: [],Id:1, action: "get"};
        //this.remove = this.remove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8090/order/getlist')
            .then(response => response.json())
            .then(data => this.setState({orders: data}));
    }

    async getReport(id){
        await fetch(`http://localhost:8090/report/client`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => this.setState({item: data}));
        this.setState({action: "reportClient"});
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        this.getReport(value);
    };

    render() {
        const {item, orders, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if(this.state.action === "get") {
            const orderList = orders.map(order => {
                return <option value={order.orderId}>{order.orderId}</option>
            })
            const {Id} = this.state;
            return (
                <div>
                <AppNavbar/>
                <FormGroup>
                    <Label for="Id">Номер проекта</Label>
                    <select name="orderId" id="orderId" defaultValue={Id || ''}
                            onChange={this.handleChange} autoComplete="orderId">{orderList}</select>
                    <Button onClick={() => this.getReport(Id)}>Получить</Button>
                </FormGroup>
                </div>
            );
        }
        if(this.state.action === "reportClient"){
            const title = <h2>Договор</h2>;
            document.body.style = 'background: #ffffff;';
            return (
                <div>
                    <AppNavbar/>
                    <div className="float-right">
                        <Button color="success" onClick={()=>this.window.reload()}>Добавить заказ</Button>
                    </div>
                    <Table className="mt-4">
                        <thead>
                        <tr align={"center"}>
                            <td colSpan="2">{title}</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="2">Общество с ограниченной ответственностью "Геликон" (ООО "Геликон") в лице директора {item.workerLastName} {item.workerName} {item.workerMiddleName},
                            действующего на основании устава компании, именуемый в дальнейшем "Исполнитель" с одной стороны и {item.clientLastName} {item.clientName} {item.clientMiddleName}
                                в лице директора , действующего на основании устава, именуемый в дальнейшем "Заказчик" заключили настоящий договор о нижеследующем:</td>
                        </tr>
                        <tr align={"center"}>
                            <td colSpan="2">1. Предмет договора</td>
                        </tr>
                        <tr>
                            <td colSpan="2">1.1 По данному договору возмездного оказания услуг Исполнитель обязуется по заданию Заказчика оказать услугу, а Заказчик обязуется оплатить эти услуги.</td>
                        </tr>
                        <tr>
                            <td colSpan="2">1.2 Срок оказания услуг с {new Date(item.orderDateOpen).getDate()}.{new Date(item.orderDateOpen).getMonth()}.{new Date(item.orderDateOpen).getFullYear()}
                                по {new Date(item.orderDateClose).getDate()}.{new Date(item.orderDateClose).getMonth()}.{new Date(item.orderDateClose).getFullYear()}</td>
                        </tr>
                        <tr align={"center"}>
                            <td colSpan="2">2. Права и обязанности сторон</td>
                        </tr>
                        <tr>
                            <td colSpan="2">2.1 Исполнитель обязан:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">{item.orderObligationContractor}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">2.2 Заказчик обязан:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">{item.orderObligationCustomer}</td>
                        </tr>
                        <tr align={"center"}>
                            <td colSpan="2">3. Размер и порядок оплаты услуг</td>
                        </tr>
                        <tr>
                            <td colSpan="2">3.1 Стоимость услуг, оказываемых по настоящему договору, оценивается в _______________________________________</td>
                        </tr>
                        <tr>
                            <td colSpan="2">3.2 В сумму, указанную в п. 3.1 включаются все расходы исполнителя, связанные с выполнением обязанностей по настоящему договору</td>
                        </tr>
                        <tr align={"center"}>
                            <td colSpan="2">4. Срок действия договора</td>
                        </tr>
                        <tr>
                            <td colSpan="2">4.1 Настоящий договор заключен на срок выполнения работ, указанный в п. 1.3 и вступает в силу момента его подписания сторонами</td>
                        </tr>
                        <tr align={"center"}>
                            <td colSpan="2">5. Термины договора</td>
                        </tr>
                        <tr>
                            <td colSpan="2">5.1 Терминами настоящего договора являются:</td>
                        </tr>
                        <tr>
                            <td colSpan="2">{item.orderTermsContract}</td>
                        </tr>
                        <tr align={"center"}>
                            <td colSpan="2">6. Данные сторон</td>
                        </tr>
                        <tr>
                            <td width={"50%"}>Исполнитель: Общество с ограниченной ответственностью "Геликон" (ООО "Геликон"), находящийся по адресу {item.companyLegalCity},
                                {item.companyLegalStreet} {item.companyLegalHouse}, т. {item.companyPhoneNumber}</td>
                            <td width={"50%"}>Заказчик {item.clientCompanyName}, Находящийся по адресу {item.clientCity}, {item.clientStreet} {item.clientHouse}, т. {item.clientPhoneNumber}</td>
                        </tr>
                        <tr>
                            <td>Генеральный директор</td>
                            <td>Генеральный директор</td>
                        </tr>
                        <tr>
                            <td>______________________/_______________________</td>
                            <td>______________________/_______________________</td>
                        </tr>
                        <tr>
                            <td>              подпись/расшифровка</td>
                            <td>              подпись/расшифровка</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            );
        }
    }
}
export default Report;