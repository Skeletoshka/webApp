import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

export const DateInput = React.forwardRef((props, ref) => {
    const [state] = React.useState({ open: false })
    return <DatePicker
        format={"DD.MM.YYYY"}
        {...props}
        ref={ref}
        onOpenChange={(open) => { state.open = open }}
        onKeyDown={(ev) => { if (state.open) ev.stopPropagation(); }}
    />
})

export const DateInputRange = React.forwardRef((props, ref) => {
    const [state] = React.useState({ open: false })
    const openChangeHandle = (open) => {
        if(props.onOpenChange) {
            props.onOpenChange(open);
        }
        state.open = open
    }
    return <RangePicker format={"DD.MM.YYYY"}
                        ranges={{
                            'Сегодня': [moment().startOf('day'), moment().endOf('day')],
                            'Тек.неделя': [moment().startOf('week'), moment().endOf('week')],
                            'Тек.месяц': [moment().startOf('month'), moment().endOf('month')],
                            'Пред.месяц': [moment().startOf('month').subtract(1, 'months'), moment().endOf('month').subtract(1, 'months')],
                            'Тек.квартал': [moment().startOf('quarter'), moment().endOf('quarter')],
                            'Тек.год': [moment().startOf('year'), moment().endOf('year')],
                        }}
                        {...props}
                        ref={ref}
                        onOpenChange={openChangeHandle}
                        onKeyDown={(ev) => { if (state.open) ev.stopPropagation(); }}
    />
})

