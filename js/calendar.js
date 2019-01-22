const Helpers = {
    isValidDate: (date) => {
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
    },
    getFormattedDate: (date) => {
        const d = new Date(date);
        let month = '' + d.getMonth(),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return `${year}/${month}/${day}`;
    },
    getUpdatedObject: (oldObject, updatedObject) => {
        return Object.assign({}, oldObject, updatedObject);
    }
};

const AppointmentItem = ({ dateKey, appointment, onAppointmentItemClick }) => {
    return (
        <div className="appointment__item" data-datekey={dateKey} onClick={onAppointmentItemClick}>
            { (appointment && appointment.title) && 
                <div className="appointment__item-content">
                    <div className="appointment__item-indicator"></div>
                    <div className="appointment__item-title truncate--small"> {  appointment.title } </div>
                </div>
            }
        </div>
    )
}

const AppointmentDetail = ({ appointment, onAppointmentEdit, onAppointmentDelete, onCancelClick }) => {
    const { title, description, date} = appointment;
    return (
        <div className="p-1">
            <div className="section-heading">
                Appointment Detail
            </div>
            <div className="content appointment__detail">
                <div className="card">
                    <div className="card-header has-background-primary">
                        <div className="card-header-title appointment__detail-title">
                            { title } 
                        </div>
                        <button className="delete" onClick={onCancelClick}></button>
                    </div>
                    <div className="card-content">
                        <div className="content">
                            <p className="appointment__detail-description"> { description } </p>
                            <p className="appointment__detail-date"> { date.toLocaleString() }</p>
                            <div>
                            </div>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <a className="button br-0 is-warning card-footer-item" onClick={onAppointmentEdit}>Edit</a>
                        <a className="button br-0 is-danger card-footer-item" onClick={onAppointmentDelete}>Delete</a>
                    </footer>
                </div>
            </div>
        </div>
    )
}

const AppointmentForm = ({ isEditMode, appointment, onInputChange, onAppointmentFormSubmit, onAppointmentFormCancel }) => {
    const { title, description, date} = appointment;
    isEditMode = isEditMode || false;
    const formTitle = (isEditMode) ? 'Update Appointment' : 'Add New Appointment';
    return (
        <div>
            <div className="section-heading">
                <h3>{ formTitle }</h3>
            </div>
            <form className="has-background-white-ter p-1" onSubmit={onAppointmentFormSubmit} data-datakey={Helpers.getFormattedDate(date)}>
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input name="title" value={title} className="input" type="text" placeholder="Enter Title" onChange={onInputChange} required/>
                    </div>
                </div>
                <div class="field mb-3">
                    <label class="label">Description</label>
                    <div class="control">
                        <textarea name="description" class="textarea" placeholder="Enter Description" onChange={onInputChange}>{description}</textarea>
                    </div>
                    <p className="is-italic"><span className="has-text-weight-bold ">Appointment Date:</span> { date.toLocaleString() }</p>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-primary">Save</button>
                    </div>
                    <div class="control">
                        <button type="button" class="button" onClick={onAppointmentFormCancel}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

const CalendarHeader = (props) => {
    const { onPrevMonthClick, onNextMonthClick, monthName, year } = props;
    return (
        <div className="calendar__header">
            <div className="calendar__controls">
                <div className="calendar__control-icon" onClick={onPrevMonthClick}>
                    <span className="icon is-medium">&#60;</span>
                </div>
                <div className="calendar__control-icon" onClick={onNextMonthClick}>
                    <span className="icon is-medium">&#62;</span>
                </div>
            </div>
            <div className="calendar__title">{monthName} {year}</div>
        </div>
    );
}

const CalendarRowItem = props => {
    const { day, date, index, onCalendarItemClick, onAppointmentItemClick, appointments } = props;
    const dateKey = Helpers.getFormattedDate(new Date(date.getFullYear(), date.getMonth(), day));
    const _getDayAppointment = (appointments, dateKey) => {
        return appointments.hasOwnProperty(dateKey) ? appointments[dateKey] : null;
    };
    const appointment = _getDayAppointment(appointments, dateKey);
    if (day > 0) {
        return (
            <td key={index}>
                <div className="calendar__item" onClick={onCalendarItemClick} data-datekey={dateKey}>
                    <div className="calendar__item-title" onClick={e => e.stopPropagation()}>{day}</div>
                    { appointment && <AppointmentItem 
                                        date={date} dateKey={dateKey} 
                                        appointment={appointment} 
                                        onAppointmentItemClick={onAppointmentItemClick}
                                    />
                    }
                </div>
            </td>
        );
    }    
    return (
        <td key={index}>&nbsp;</td>
    );
}

const CalenderRowList = ({ date, onCalendarItemClick, onAppointmentItemClick, appointments }) => {
    const _getCalendarDays = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate(); // 28 - 31
        let weekDay = new Date(year, month, 1).getDay(); // 0 - 6
        let calendarDays = [];
        let i = 1;

        // build initial calendar days
        while (i <= numberOfDaysInMonth) {
            calendarDays.push(i);
            i++;
        }

        // insert offsets to calendar days
        while (weekDay > 0) {
            calendarDays.unshift(-1);
            weekDay--;
        }
        return calendarDays;
    };
    const _getCalendarBody = (calendarDays) => {
        let rows = [];
        let rowItems = [];
        let itemCount = 1;
        calendarDays.map((dayNumber, index) => {
            rowItems.push(<CalendarRowItem 
                                date={date} day={dayNumber} index={index} 
                                onCalendarItemClick={onCalendarItemClick} 
                                onAppointmentItemClick={onAppointmentItemClick}
                                appointments={appointments}
                            />
            );
            if (itemCount % 7 === 0) {
                rows.push(<tr key={`row_${index}`}>{rowItems}</tr>);
                rowItems = [];
            }
            itemCount++;
        });

        // handle edge case: when remaining rowitems is less than a mulitple of 7
        if (rowItems.length > 0) {
            rows.push(<tr key={'row_last'}>{rowItems}</tr>);
        }
        return rows;
    };

    return (
        _getCalendarBody(_getCalendarDays(date))
    )
};

const CalendarBody = props => {
    const { date, onCalendarItemClick, onAppointmentItemClick, appointments } = props;
    return (
        <table className="table is-bordered is-fullwidth calendar__table calendar__table--center">
            <thead>
                <tr>
                    <td>Sun</td>
                    <td>Mon</td>
                    <td>Tue</td>
                    <td>Wed</td>
                    <td>Thu</td>
                    <td>Fri</td>
                    <td>Sat</td>
                </tr>
            </thead>
            <tbody>
                <CalenderRowList 
                    date={date} 
                    onCalendarItemClick={onCalendarItemClick} 
                    onAppointmentItemClick={onAppointmentItemClick} 
                    appointments={appointments}
                />
            </tbody>
        </table>
    )
}


const Calendar = props => {
    /**
     * Week Days => Sunday (0) - Saturday (6)
     * Months => January (0) - December (11)
     */
    const MONTH_NAMES = {
        "0": "January",
        "1": "February",
        "2": "March",
        "3": "April",
        "4": "May",
        "5": "June",
        "6": "July",
        "7": "August",
        "8": "September",
        "9": "October",
        "10": "November",
        "11": "December"
    };
    const { 
        date, onPrevMonthClick, onNextMonthClick, onCalendarItemClick, 
        onAppointmentItemClick, appointments
    } = props;
    const year = date.getFullYear();
    const monthName = MONTH_NAMES[date.getMonth()];

    return (
        <div className="calendar calender--light p-1">
            <CalendarHeader
                onPrevMonthClick={onPrevMonthClick}
                onNextMonthClick={onNextMonthClick}
                monthName={monthName}
                year={year}
            />
            <CalendarBody
                date={date}
                onCalendarItemClick={onCalendarItemClick}
                onAppointmentItemClick={onAppointmentItemClick}
                appointments={appointments}
            />
        </div>
    );
};


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarData: {
                currentDate: new Date(),
            },
            appointments: {},
            appointment: {
                id: null,
                title: '',
                description: '',
                date: null,
            },
            isNewAppointment: false,
            isEditAppointment: false,
            isViewAppointment: false,
        };

        this.handlePrevMonthClick = this.handlePrevMonthClick.bind(this);
        this.handleNextMonthClick = this.handleNextMonthClick.bind(this);
        this.handleCalendarItemClick = this.handleCalendarItemClick.bind(this);
        this.handleAppointmentItemClick = this.handleAppointmentItemClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAppointmentFormSubmit = this.handleAppointmentFormSubmit.bind(this);
        this.handleAppointmentUpdateFormSubmit = this.handleAppointmentUpdateFormSubmit.bind(this);
        this.handleAppointmentActionCancel = this.handleAppointmentActionCancel.bind(this);
        this.resetSideViews = this.resetSideViews.bind(this);
        this.handleAppointmentEdit = this.handleAppointmentEdit.bind(this);
        this.handleAppointmentDelete = this.handleAppointmentDelete.bind(this);
    }

    get initialAppointmentState() {
        return {
            id: null,
            title: '',
            description: '',
            date: null,
        }
    }

    getPrevMonthDate(date) {
        /**
         * 
         * check if previous month is less than  January (0)
         * and decrement year by one and set previous month to December (11)
         * 
         * returns new Date()
         */
        if (!Helpers.isValidDate(date)) {
            throw new Error('ArgumentError: Invalid Date');
        }
        let prevMonth = date.getMonth() - 1;
        let year = date.getFullYear();
        if (prevMonth < 0) {
            year -= 1;
            prevMonth = 11;
        }
        return new Date(year, prevMonth);
    }

    getNextMonthDate(date) {
        /**
         * 
         * checks if next month is more than December (11)
         * and increment year by one and set next month to January (0)
         * 
         * returns new Date()
         */
        if (!Helpers.isValidDate(date)) {
            throw new Error('ArgumentError: Invalid Date');
        }
        let nextMonth = date.getMonth() + 1;
        let year = date.getFullYear();
        if (nextMonth > 11) {
            year += 1;
            nextMonth = 0;
        }
        return new Date(year, nextMonth);
    }

    handlePrevMonthClick() {
        this.setState({
            calendarData: { currentDate: this.getPrevMonthDate(this.state.calendarData.currentDate) }
        });
    }
    handleNextMonthClick() {
        this.setState({
            calendarData: { currentDate: this.getNextMonthDate(this.state.calendarData.currentDate) }
        });
    }

    handleInputChange(e) {
        let tempAppointment = { ...this.state.appointment };
        tempAppointment[e.target.name] = e.target.value;
        this.setState({
            appointment: tempAppointment 
        });
    }

    resetSideViews() {
        this.setState({
            isEditAppointment: false,
            isNewAppointment: false,
            isViewAppointment: false
        })
    }
    
    handleCalendarItemClick(e) {
        e.stopPropagation();
        this.resetSideViews();
        const dataKey = e.currentTarget.dataset.datekey;
        const dateFields = dataKey.split('/');
        const itemDate = new Date(dateFields[0], dateFields[1], dateFields[2]);
        const newAppointment = this.initialAppointmentState;
        newAppointment.id = dataKey;
        newAppointment.date = itemDate;
        this.setState({
            appointment: newAppointment,
            isNewAppointment: true
        });
    }

    handleAppointmentItemClick(e) {
        e.stopPropagation();
        this.resetSideViews();
        const dataKey = e.currentTarget.dataset.datekey;
        const { appointments } = this.state;
        if (appointments.hasOwnProperty(dataKey)) {
            this.setState({
                isViewAppointment: true,
                appointment: { ...appointments[dataKey] }
            });
        }
    }

    handleAppointmentFormSubmit(e) {
        e.preventDefault();
        const { appointments, appointment } = this.state;
        if (appointments.hasOwnProperty(appointment.id)) {
            alert('An appointment already exists on this day.');
            return;
        }
        const currentAppointments = { ...appointments };
        currentAppointments[appointment.id] = appointment;
        this.setState({
            appointments: currentAppointments
        });
        // reset form
        e.currentTarget.reset();
        this.setState({ 
            appointment: this.initialAppointmentState,
            isNewAppointment: false
        });
    }

    handleAppointmentEdit(e) {
        this.setState({
            isViewAppointment: false,
            isEditAppointment: true
        });
    }

    handleAppointmentDelete(e) {
        const { appointments, appointment } = this.state;
        if (appointments.hasOwnProperty(appointment.id) && confirm("Are you sure you want to delete this Appointment?")) {
            const currentAppointments = { ...appointments };
            delete currentAppointments[appointment.id];
            this.setState({
                appointments: currentAppointments
            });
        }
        this.resetSideViews();
    }
    
    handleAppointmentUpdateFormSubmit(e) {
        e.preventDefault();
        const { appointments, appointment } = this.state;
        if (appointments.hasOwnProperty(appointment.id)) {
            const currentAppointments = { ...appointments };
            appointment.date = new Date(Date.now());
            currentAppointments[appointment.id] = appointment;
            this.setState({
                appointments: currentAppointments
            });
            // reset form
            e.currentTarget.reset();
            this.resetSideViews();
            this.setState({ 
                appointment: this.initialAppointmentState,
            });
        }
    }

    handleAppointmentActionCancel(e) {
        this.resetSideViews();
        this.setState({
            appointment: this.initialAppointmentState
        });
    }

    render() {
        const { calendarData, appointments, isEditAppointment,
                isNewAppointment, isViewAppointment, appointment 
        } = this.state;
        const isActivateSideView = isNewAppointment || isViewAppointment || isEditAppointment;
        return (
            <div className="container">
                <div className="columns">
                    <div className="column">
                        <Calendar
                            date={calendarData.currentDate}
                            onPrevMonthClick={this.handlePrevMonthClick}
                            onNextMonthClick={this.handleNextMonthClick}
                            onCalendarItemClick={this.handleCalendarItemClick}
                            onAppointmentItemClick={this.handleAppointmentItemClick}
                            appointments={appointments}
                        />
                    </div>
                    { isActivateSideView && <div className="column is-one-third">
                                { isNewAppointment && <AppointmentForm 
                                    appointment={appointment} onInputChange={this.handleInputChange}
                                    onAppointmentFormSubmit={this.handleAppointmentFormSubmit}
                                    onAppointmentFormCancel={this.handleAppointmentActionCancel} />
                                }
                                { isViewAppointment && <AppointmentDetail 
                                                            appointment={appointment}
                                                            onAppointmentEdit={this.handleAppointmentEdit}
                                                            onAppointmentDelete={this.handleAppointmentDelete}
                                                            onCancelClick={this.handleAppointmentActionCancel}
                                                        /> 
                                }
                                { isEditAppointment && <AppointmentForm 
                                    appointment={appointment} onInputChange={this.handleInputChange}
                                    onAppointmentFormSubmit={this.handleAppointmentUpdateFormSubmit}
                                    onAppointmentFormCancel={this.handleAppointmentActionCancel} />
                                }
                        </div>
                    }
                
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));