import { ForwardOutlined, LibraryBooksOutlined, NotInterestedOutlined, TaskAltOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Chip, ChipOwnProps, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, styled, Switch, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { TASK_STATUS, TaskStatusKey } from '../constants/Constants';
import { TaskRow as Row } from '../constants/Types';
import { addTask, deleteTask, initIndexDb, listTasks } from '../logics/LocalStrageAsync';
import dayjs from 'dayjs';
import { AddRowAction } from './MainPage';

const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', type: 'dateTime', width: 130, valueFormatter: (value?: Date) => { return dayjs(value).format('YYYY/MM/DD HH:mm') }},
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'notify', headerName: 'Notify', width: 90, renderCell: renderNotify, },
    { field: 'notifyInterval', headerName: 'Interval', width: 90 },
    { field: 'status', headerName: 'Status', width: 150, renderCell: renderStatus, },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Statuses = {
    NOT_READY: { icon: <NotInterestedOutlined />, label: TASK_STATUS.NOT_READY, color: 'default' },
    READY: { icon: <LibraryBooksOutlined />, label: TASK_STATUS.READY, color: 'default' },
    DOING: { icon: <ForwardOutlined />, label: TASK_STATUS.DOING, color: 'primary' },
    DONE: { icon: <TaskAltOutlined />, label: TASK_STATUS.DONE, color: 'success' },
} satisfies Record<TaskStatusKey, ChipOwnProps>

let deleteIdList: number[] = [];

function renderNotify(props: GridRenderCellParams) {
    return (
        <Switch defaultChecked={props.value} />
    );
}

function renderStatus(props: GridRenderCellParams) {
    const key: TaskStatusKey = props.value;
    const status = Statuses[key] ?? Statuses.READY;
    return (
        <Chip {...status} />
    );
}

export type addRow = (row: Row) => void;

export type Param = {
    addRowAction: AddRowAction,
}

export default function Tasks(param: Param) {
    console.log('Tasks is called.');

    // get tasks
    useEffect(() => {
        initIndexDb()
            .then(() => { return listTasks() })
            .then((rows) => setRows(rows));
    }, []);

    // Table Top
    const [hideCompleted, setHideCompleted] = useState(false);
    const handleChangeHideCompleted = (evt: React.ChangeEvent<HTMLInputElement>) => setHideCompleted(evt.target.checked);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
    const handleDelete = () => {
        deleteTask(deleteIdList).then(() => {
            console.log(`delete tasks. count=${deleteIdList.length}`);
            deleteIdList.splice(0);
        })
        .then(() => { return listTasks() })
        .then((rows) => setRows(rows));
        handleClose();
    };

    // Taable
    const [rows, setRows] = useState<Row[]>([]);
    const handleRowSelected = (evt: GridRowSelectionModel) => {
        setDeleteButtonDisabled(evt.length <= 0);
        deleteIdList = evt.filter((value) => typeof value === "number");
    };

    // callback add row function
    const addRow = (row: Row) => {
        row.id = Date.now();
        addTask(row)
            .then(() => { return listTasks() })
            .then((_) => { setRows((prevRows) => [...prevRows, row]) });
    };
    param.addRowAction.addRow = addRow;

    // Dialog
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box sx={{ height: '100%' }}>
                <Box sx={{  }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <FormControlLabel control={<Switch value={hideCompleted} onChange={handleChangeHideCompleted} />} label="完了を非表示" />
                        <Button variant="outlined" size="small" onClick={handleClickOpen} disabled={deleteButtonDisabled}>delete rows</Button>
                    </Stack>
                </Box>
                <Box sx={{  }}>
                    <DataGrid
                        checkboxSelection
                        rows={rows}
                        columns={columns}
                        onRowSelectionModelChange={handleRowSelected}         
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}           
                        pageSizeOptions={[5, 10, 25]}
                    />
                </Box>
            </Box>
            <BootstrapDialog
                onClose={handleClose}
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <Alert severity="warning">タスクを削除します！</Alert>
                </DialogTitle>
                <IconButton
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        選択されたタスクを削除します。一度削除したタスクはもとに戻すことはできません。
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}