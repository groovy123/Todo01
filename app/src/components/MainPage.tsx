import { Box, Paper, Typography } from "@mui/material";
import Form from "./Form";
import Tasks, { addRow } from "./Tasks";

export interface AddRowAction {
    addRow?: addRow;
}

const addRowAction: AddRowAction = {
}

export function MainPage() {
    return (
        <>
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ padding: 2, mt: 2 }}>
                    <Form addRowAction={addRowAction} />
                </Paper>
                <Paper sx={{ padding: 2, mt: 2, flexGrow: 1 }}>
                    <Tasks addRowAction={addRowAction} />
                </Paper>
            </Box>
        </>
    );
}