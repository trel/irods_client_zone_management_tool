import React, { useEffect, useState } from 'react';
import axios from 'axios';

import BlockIcon from '@material-ui/icons/Block';
import CircularProgress from '@material-ui/core/CircularProgress';
import Appbar from '../components/Appbar';
import Sidebar from '../components/Sidebar';
import Cookies from 'js-cookie';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    main: {
        whiteSpace: "pre-wrap",
        fontSize: 20
    },
    logout: {
        marginTop: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: theme.spacing(3)
    },
    dialog_action: {
        margin: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
        width: 200
    },
    table: {
        minWidth: 650
    },
    tableContainer: {
        marginTop: 20
    },
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    progress: {

    }
}));

function Resource() {
    console.log("Visited");
    const classes = useStyles();
    const token = Cookies.get('token');
    const isAuthenticated = token != null ? true : false;

    const [isLoading, setLoading] = useState(false);
    const [rescView, setRescView] = useState('list');
    const [resc, setResc] = useState([]);
    const [zones, setZone] = useState([]);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [addResult, setAddResult] = useState();

    const [rescName, setRescName] = useState();
    const [rescType, setRescType] = useState();
    const [rescLocation, setRescLocation] = useState();
    const [rescZone, setRescZone] = useState();
    let resc_id = 0;

    useEffect(() => {
        const rescResult = axios({
            method: 'GET',
            url: 'http://54.210.60.122:80/irods-rest/1.0.0/query',
            headers: {
                'Authorization': token,
                'Accept': 'application/json'
            },
            params: {
                query_string: 'SELECT RESC_NAME,RESC_TYPE_NAME,RESC_ZONE_NAME',
                query_limit: 100,
                row_offset: 0,
                query_type: 'general'
            }
        }).then(res => {
            const sortedArray = [...res.data._embedded];
            sortedArray.sort();
            setResc(sortedArray);
        });

        const zoneResult = axios({
            method: 'GET',
            url: 'http://54.210.60.122:80/irods-rest/1.0.0/query',
            headers: {
                'Authorization': token,
                'Accept': 'application/json'
            },
            params: {
                query_string: 'SELECT USER_ZONE',
                query_limit: 100,
                row_offset: 0,
                query_type: 'general'
            }
        }).then(res => {
            setZone(res.data._embedded);
        })
    }, [isAuthenticated])

    async function addResource() {
        try {
            setLoading(true);
            const rescAddResult = await axios({
                method: 'POST',
                url: 'http://54.210.60.122:80/irods-rest/1.0.0/admin',
                headers: {
                    'Authorization': token
                },
                params: {
                    action: 'add',
                    target: 'resource',
                    arg2: rescName,
                    arg3: rescType,
                    arg4: rescLocation,
                    arg5: "",
                    arg6: rescZone
                }
            }).then(res => {
                console.log(res);
                window.location.reload();
                setAddResult("Resource created.")
                setLoading(false);
            })
        }catch(e){
            console.log(e);
            setAddResult("Failed to create resource.");
            setLoading(false);
        }
    }

    const handleAddFormOpen = () => {
        setAddFormOpen(true);
    }

    const handleAddFormClose = () => {
        setAddFormOpen(false);
    }

    const handleRescNameChange = event => {
        setRescName(event.target.value);
    }

    const handleRescTypeChange = event => {
        setRescType(event.target.value);
    }

    const handleRescLocationChange = event => {
        setRescLocation(event.target.value);
    }
    const handleRescZoneChange = event => {
        setRescZone(event.target.value);
    }


    return (
        <div>
            {isAuthenticated == true ? <div className={classes.root}>
                <Appbar />
                <Sidebar />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div className={classes.main}>
                        <Button variant="outlined" color="primary" onClick={handleAddFormOpen}>Add Resource</Button>
                        <br />
                        <TableContainer className={classes.tableContainer} component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Resource Name</b></TableCell>
                                        <TableCell align="right"><b>Type</b></TableCell>
                                        <TableCell align="right"><b>Zone</b></TableCell>
                                        <TableCell align="right"><b>Action</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resc.map(this_resc =>
                                        <TableRow key={resc_id}>
                                            <TableCell component="th" scope="row">{this_resc[0]}</TableCell>
                                            <TableCell align="right">{this_resc[1]}</TableCell>
                                            <TableCell align="right">{this_resc[2]}</TableCell>
                                            <TableCell align="right"><Button id={resc_id++}>Info</Button></TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Dialog open={addFormOpen} onClose={handleAddFormClose} aria-labelledby="form-dialog-title">
                            <DialogTitle>Add New Resource</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    You can add a new resource there.
                                </DialogContentText>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        native
                                        id="name"
                                        label="Resource name"
                                        onChange={handleRescNameChange}
                                    />
                                </FormControl>
                                <br />
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="user-type-select">Type</InputLabel>
                                    <Select
                                        native
                                        id="zone-type-select"
                                        onChange={handleRescTypeChange}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value="compound">Compound</option>
                                        <option value="load_balance">Load Balance</option>
                                        <option value="passthru">Passthru</option>
                                        <option value="random">Random</option>
                                        <option value="replication">Replication</option>
                                        <option value="round_robin">Round Robin</option>
                                        <option value="deferred">Deferred</option>
                                        <option value="emc_ecs">EMC ECS</option>
                                        <option value="emc_isilon">EMC Isilon</option>
                                        <option value="mockarchive">Mockarchive</option>
                                        <option value="mso">MSO</option>
                                        <option value="mssofile">MSSOFile</option>
                                        <option value="non_blocking">Non-blocking</option>
                                        <option value="struct_file">Struct file</option>
                                        <option value="universal_mass_storage">Universal Mass Storage</option>
                                        <option value="unixfilesystem">Unix File System</option>
                                        <option value="wos">WOS</option>
                                    </Select>
                                </FormControl>
                                <br />
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        native
                                        id="location"
                                        label="Location"
                                        onChange={handleRescLocationChange}
                                    />
                                </FormControl>
                                <br />
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="user-type-select">Zone</InputLabel>
                                    <Select
                                        native
                                        id="zone"
                                        label="Zone Name"
                                        onChange={handleRescZoneChange}
                                    >
                                        <option selected value="" disabled></option>
                                        {zones.map(zone => <option value={zone[0]}>{zone[0]}</option>)}
                                    </Select>
                                </FormControl>
                                {isLoading == true ? <div className={classes.progress}>Adding in progress...<CircularProgress /></div> : <p>{addResult}</p>}
                            </DialogContent>
                            <DialogActions className={classes.dialog_action}>
                                <Button onClick={addResource} variant="outlined" color="primary">Save</Button>
                                <Button onClick={handleAddFormClose} variant="outlined" color="primary">Cancel</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </main>
            </div> : <div className={classes.logout}><BlockIcon /><br /><div>Please <a href="http://localhost:3000/">login</a> to use the administration dashboard.</div></div>}
        </div>
    );
}

export default Resource;