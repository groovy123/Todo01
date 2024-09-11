import { Button, FormControl, FormControlLabel, FormGroup, Grid2 as Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import 'dayjs/locale/ja';
import { ChangeEvent, useState } from "react";
import { TaskRow } from "../constants/Types";
import { Callback } from "../logics/Callback";

// dyajs plugins
dayjs.locale('ja');

type FormValues = {
    title: string,
    date: dayjs.Dayjs | null,
    interval: number,
    isNotify: boolean,
}

function parseInt(val: string | number) {
    const ret = Number(val);
    return isNaN(ret) ? 0 : ret;
}

export type Param = {
    callback: Callback<TaskRow>,
}

export default function Form(param: Param) {
    const [values, setValues] = useState<FormValues>({
        title: "",
        date: dayjs(),
        interval: 60,
        isNotify: false,
    });

    const handleChangeTitle = (evt: ChangeEvent<HTMLInputElement>) => setValues({ ...values, title: evt.target.value });
    const handleChangeDate = (newValue: dayjs.Dayjs | null) => setValues({ ...values, date: newValue });
    const handleChangeInterval = (evt: SelectChangeEvent<typeof values.interval>) => setValues({ ...values, interval: parseInt(evt.target.value) });
    const handleChangeNotify = (evt: ChangeEvent<HTMLInputElement>) => setValues({ ...values, isNotify: evt.target.checked });
    const handleClickAddRow = () => {
        param.callback.notify({
            id: 0,
            title: values.title,
            date: values.date?.toDate() ?? new Date(),
            notify: values.isNotify,
            notifyInterval: values.interval,
            status: "READY",
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField fullWidth label="タイトル" id="txtTitle" value={values.title} onChange={handleChangeTitle} />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <DateTimePicker
                        label="対象日時"
                        format="YYYY/MM/DD HH:mm"
                        value={values.date}
                        onChange={handleChangeDate}
                    />
                </Grid>
                <Grid size={{ xs: 3, md: 3 }}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={values.isNotify} onChange={handleChangeNotify} />} label="繰り返し" />
                    </FormGroup>
                </Grid>
                <Grid size={{ xs: 3, md: 3 }}>
                    <FormControl fullWidth disabled={!values.isNotify}>
                        <InputLabel id="demo-simple-select-label">繰り返し間隔</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.interval}
                            label="繰り返し間隔"
                            onChange={handleChangeInterval}
                        >
                            <MenuItem value={10}>10分</MenuItem>
                            <MenuItem value={30}>30分</MenuItem>
                            <MenuItem value={60}>1時間</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <Button variant="contained" sx={{ verticalAlign: "bottom" }} onClick={handleClickAddRow}>追加</Button>
                </Grid>
            </Grid>
        </LocalizationProvider>
    )
}
