import { Box, Paper, Typography } from "@mui/material";
import { TaskRow } from "../constants/Types";
import { Callback } from "../logics/Callback";
import Form from "./Form";
import Tasks, { addRow } from "./Tasks";

export function MainPage() {

    // get addRow function
    const taskCallback: Callback<addRow> = {
        notify: notifyAddRow,
    }

    function notifyAddRow(value: addRow): void {
        taskCallback.value = value;
    }

    // get form value;
    const formCallback: Callback<TaskRow> = {
        notify: notifyTaskRow,
    }
    function notifyTaskRow(value: TaskRow): void {
        if (taskCallback.value) {
            taskCallback.value(value);
        }
    }

    return (
        <>
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ padding: 2, mt: 2 }}>
                    <Form callback={formCallback} />
                </Paper>
                <Paper sx={{ padding: 2, mt: 2, flexGrow: 1 }}>
                    <Tasks callback={taskCallback} />
                </Paper>
            </Box>
        </>
    );
}