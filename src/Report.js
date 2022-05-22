import React, {Component, useEffect, useState} from 'react';
import {Button, FormGroup, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const emptyItem = {
    dateStart: new Date().toISOString(),
    dateEnd: new Date().toISOString()
}

//let workers, workerList, projects, projectList, orders, orderList, tasks, taskList, item, id, taskChartList, projectTeamList, dateRange = emptyItem, action = "get";
let item;

export default function Report() {

    const [workers, setWorkers] = useState();
    const [workerList, setWorkerList] = useState();
    const [projectList, setProjectList] = useState();
    const [orders, setOrders] = useState();
    const [orderList, setOrderList] = useState();
    const [tasks, setTasks] = useState();
    const [projects, setProjects] = useState();
    const [taskList, setTaskList] = useState();
    //const [item, setItem] = useState();
    const [id, setId] = useState();
    const [taskChartList, setTaskChartList] = useState();
    const [projectTeamList, setProjectTeamList] = useState();
    const [dateRange, setDateRange] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() => {
        fetch('http://localhost:8090/order/getlist')
            .then(response => response.json())
            .then(data => setOrders(data));
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => setWorkers(data));
        fetch('http://localhost:8090/task/getlist')
            .then(response => response.json())
            .then(data => setTasks(data));
        fetch('http://localhost:8090/project/getlist')
            .then(response => response.json())
            .then(data => setProjects(data));
    }, [action])

    async function getReport(id){
        await fetch(`http://localhost:8090/report/client`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("reportClient");
    }

    async function getOrderStat(id){
        await fetch(`http://localhost:8090/report/orderstat`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("orderStat");
    }

    async function getProjectStat(id){
        await fetch(`http://localhost:8090/report/projectstat`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("projectStat");
    }

    async function getProjectTeam(id){
        await fetch(`http://localhost:8090/report/projectteam`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("projectTeam");
    }

    async function acceptWorker(id){
        await fetch(`http://localhost:8090/report/worker`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("acceptWorker");
    }

    async function taskChart(id){
        await fetch(`http://localhost:8090/report/taskchart`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("taskChart");
    }

    async function getTaskInRange(){
        await fetch(`http://localhost:8090/report/taskrange`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dateRange)
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("taskRange");
    }

    async function dismissWorker(id){
        await fetch(`http://localhost:8090/report/worker`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: id
        })
            .then(response => response.json())
            .then(data => item = (data));
        setAction("dismissWorker");
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setId(value);
    }

    function handleDateStartChange(value){
        let item1 = dateRange;
        item1["dateStart"] = value
        setDateRange(item1)
    }

    function handleDateEndChange(value){
        let item1 = dateRange;
        item1["dateEnd"] = new Date(value)
        setDateRange(item1)
    }

    function view(){
        setOrderList(orders?.map(order => {
            return <option value={order.orderId}>{order.orderId}</option>
        }));
        setProjectList(projects?.map(project => {
            return <option value={project.projectId}>{project.projectId}</option>
        }));
        setWorkerList(workers?.map(worker => {
            return <option value = {worker.workerId}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</option>
        }));
        setTaskList(tasks?.map(task => {
            return <option value = {task.taskId}>{task.taskMission}</option>
        }));
        setTaskChartList(item?.map(taskChart => {
            return <tr><td>{new Date(taskChart.moveDateEnd).toLocaleDateString()}</td><td>{taskChart.moveCount}</td></tr>
        }));
        setProjectTeamList(item?.map(worker => {
            return <tr><td>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</td></tr>
        }));
    }


    if(action === "get") {
        document.body.style = 'background: #61dafb;';
        return (
            <div>
            <AppNavbar/>
            <Button color="warning" onClick={()=>view()}>Обновить</Button>
            <FormGroup>
                <Label for="Id">Номер заказа</Label>
                <select name="orderId" id="orderId" defaultValue={id || ''}
                        onChange={handleChange} autoComplete="orderId">{orderList}</select>
                <Button onClick={() => getReport(id)}>Получить</Button>
                <Button onClick={() => getOrderStat(id)}>Статистика завершения</Button>
            </FormGroup>
            <FormGroup>
                <Label for="Id">Сотрудник</Label>
                <select name="workerId" id="workerId" defaultValue={id || ''}
                        onChange={handleChange} autoComplete="workerId">{workerList}</select>
                <Button onClick={() => acceptWorker(id)}>Принять</Button>
                <Button onClick={() => dismissWorker(id)}>Уволить</Button>
            </FormGroup>
            <FormGroup>
                <Label for="Id">Задача</Label>
                <select name="taskId" id="taskId" defaultValue={id || ''}
                        onChange={handleChange} autoComplete="taskId">{taskList}</select>
                <Button onClick={() => taskChart(id)}>График</Button>
            </FormGroup>
            <FormGroup>
                <Label for="Id">Номер проекта</Label>
                <select name="projectId" id="projectId" defaultValue={id || ''}
                        onChange={handleChange} autoComplete="projectId">{projectList}</select>
                <Button onClick={() => getProjectStat(id)}>Статистика завершения</Button>
                <Button onClick={() => getProjectTeam(id)}>Проектная команда</Button>
            </FormGroup>
            <FormGroup>
                <Label>Период для задач</Label>
                <Calendar value={new Date(new Date(dateRange.dateStart).getTime())} onChange={handleDateStartChange} returnValue={"start"}/>
                <Calendar value={new Date(new Date(dateRange.dateEnd).getTime())} onChange={handleDateEndChange} returnValue={"start"}/>
                <Button onClick={() => getTaskInRange()}>Количество задач</Button>
            </FormGroup>
            </div>
        );
    }
    if(action === "reportClient"){
        const title = <h2>Договор</h2>;
        document.body.style = 'background: #ffffff;';
        return (
            <div>
                <AppNavbar/>
                <div className="float-right">
                    <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                    <Button color="warning" onClick={()=>view()}>Обновить</Button>
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
                        <td colSpan="2">1.2 Срок оказания услуг с {new Date(item.orderDateOpen).toLocaleDateString()}
                            по {new Date(item.orderDateClose).toLocaleDateString()}</td>
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
    if(action === "acceptWorker"){
        const title = <h2>Трудовой договор</h2>;
        document.body.style = 'background: #ffffff;';
        return (
            <div>
                <AppNavbar/>
                <div className="float-right">
                    <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                    <Button color="warning" onClick={()=>view()}>Обновить</Button>
                </div>
                <Table className="mt-4">
                    <thead>
                    <tr align={"center"}>
                        <td colSpan="2">{title}</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colspan="2">Общество с ограниченной ответственностью "Геликон" (ООО "Геликон") в лице директора {item.dirLastName} {item.dirName} {item.dirMiddleName},
                            действующего на основании устава компании, именуемый в дальнейшем "Работодатель" с одной стороны и {item.workerLastName} {item.workerName} {item.workerMiddleName}
                             с другой стороны, именуемый в дальнейшем "Работник" заключили настоящий договор о нижеследующем:</td>
                    </tr>
                    <tr align={"center"}>
                        <td colSpan="2">1. Общие положения</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.1 Работник принимается на должность {item.postName}.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.2 Работа в организации является для работника основной работой.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.3 Настоящий трудовой договор вступает в силу с момента подписания его обеими сторонами.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.4 Работник фактически приступил к работе в ООО "Геликон" {new Date(item.workerDateStartJob).toLocaleDateString()}</td>
                    </tr>
                    <tr align={"center"}>
                        <td colSpan="2">6. Данные сторон</td>
                    </tr>
                    <tr>
                        <td width={"50%"}>Работодатель: Общество с ограниченной ответственностью "Геликон" (ООО "Геликон"), находящийся по адресу {item.companyLegalCity},
                            {item.companyLegalStreet} {item.companyLegalHouse}, т. {item.companyPhoneNumber}</td>
                        <td width={"50%"}>Работник {item.workerLastName} {item.workerName} {item.workerMiddleName}, Дата рождения {new Date(item.workerBirthday).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>Генеральный директор</td>
                        <td>Работник</td>
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
    if(action === "dismissWorker"){
        const title = <h2>Соглашение о расторжении трудового договора</h2>;
        document.body.style = 'background: #ffffff;';
        return (
            <div>
                <AppNavbar/>
                <div className="float-right">
                    <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                    <Button color="warning" onClick={()=>view()}>Обновить</Button>
                </div>
                <Table className="mt-4">
                    <thead>
                    <tr align={"center"}>
                        <td colSpan="2">{title}</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colspan="2">Общество с ограниченной ответственностью "Геликон" (ООО "Геликон") в лице директора {item.dirLastName} {item.dirName} {item.dirMiddleName},
                            действующего на основании устава компании, именуемый в дальнейшем "Работодатель" с одной стороны и {item.workerLastName} {item.workerName} {item.workerMiddleName}
                            с другой стороны, именуемый в дальнейшем "Работник" заключили настоящий договор о нижеследующем:</td>
                    </tr>
                    <tr align={"center"}>
                        <td colSpan="2">1. Общие положения</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.1 Стороны пришли к соглашению о расторжении трудового договора от {new Date(item.workerDateStartJob).toLocaleDateString()}
                            на следующих условиях:</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.2 Договор прекращает свое действие {new Date(item.workerDateEndJob).toLocaleDateString()} в соответствии с _____________________________________________________________.(Причина увольнения)</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.3 Работодатель обязуется предоставить работнику на основании его письменного заявления ежегодный оплачиваемый отпуск в количестве ___ дней с ________________ по _______________ 20__ года</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.4 На момент подписания настоящего соглашения стороны подтверждают, что претензий дуг к другу не имеют.</td>
                    </tr>
                    <tr>
                        <td colSpan="2">1.5 Настоящее соглашение вступает в силу с момента подписания сторонами, составлено в двух экземплярах, имеющих равную юридическую силу, по одному экземпляру для каждой из сторон.</td>
                    </tr>
                    <tr align={"center"}>
                        <td colSpan="2">6. Данные сторон</td>
                    </tr>
                    <tr>
                        <td width={"50%"}>Работодатель: Общество с ограниченной ответственностью "Геликон" (ООО "Геликон"), находящийся по адресу {item.companyLegalCity},
                            {item.companyLegalStreet} {item.companyLegalHouse}, т. {item.companyPhoneNumber}</td>
                        <td width={"50%"}>Работник {item.workerLastName} {item.workerName} {item.workerMiddleName}, Дата рождения {new Date(item.workerBirthday).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>Генеральный директор</td>
                        <td>Работник</td>
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
    if(action === "taskChart"){
        const title = <h2>Сколько движений выполнено</h2>;
        document.body.style = 'background: #ffffff;';
        return (
            <div>
                <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                <Button color="warning" onClick={()=>view()}>Обновить</Button>
                {title}
                <Table>
                    <tr>
                        <td>
                            Дата
                        </td>
                        <td>
                            Количество завершенных движений
                        </td>
                    </tr>
                        {taskChartList}
                </Table>
            </div>
        );
    }
    if(action === "orderStat"){
        const title = <h2>Сколько задач выполнено в заказе</h2>;
        document.body.style = 'background: #ffffff;';
        return (
            <div>
                <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                <Button color="warning" onClick={()=>view()}>Обновить</Button>
                {title}
                <Table>
                    <tbody>
                    <tr>
                        <td>
                            Дата
                        </td>
                        <td>
                            Количество завершенных задач
                        </td>
                    </tr>
                        {taskChartList}
                    </tbody>
                </Table>
            </div>
        );
    }
    if(action === "projectStat"){
        const title = <h2>Сколько задач выполнено в проекте</h2>;
        document.body.style = 'background: #ffffff;';
        return (
            <div>
                <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                <Button color="warning" onClick={()=>view()}>Обновить</Button>
                {title}
                <Table>
                    <tbody>
                    <tr>
                        <td>
                            Дата
                        </td>
                        <td>
                            Количество завершенных задач
                        </td>
                    </tr>
                        {taskChartList}
                    </tbody>
                </Table>
            </div>
        );
    }
    if(action === "projectTeam"){
        const title = <h2>Проектная команда</h2>;
        return (
            <div>
                <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                <Button color="warning" onClick={()=>view()}>Обновить</Button>
                {title}
                <Table>
                    <tbody>
                    <tr>
                        <td>
                            Участник проектной команды
                        </td>
                    </tr>
                        {projectTeamList}
                    </tbody>
                </Table>
            </div>
        );
    }
    if(action === "taskRange"){
        const title = <h2>Количество задач в периоде</h2>;
        return (
            <div>
                <Button color="success" onClick={()=>setAction("get")}>Назад</Button>
                <Button color="warning" onClick={()=>view()}>Обновить</Button>
                {title}
                <Table>
                    <tbody>
                    <tr>
                        <td>
                            Дата
                        </td>
                        <td>
                            Количество завершенных задач
                        </td>
                    </tr>
                        {taskChartList}
                    </tbody>
                </Table>
            </div>
        );
    }
}