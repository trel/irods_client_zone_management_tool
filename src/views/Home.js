import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import Appbar from '../components/Appbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ServerIcon from '../img/servers-logo.png';
import BlockIcon from '@material-ui/icons/Block';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Pagination from '@material-ui/lab/Pagination';
import { CssBaseline, Typography, CircularProgress } from '@material-ui/core';
import { Avatar, Button, Card, CardHeader, CardActions, CardContent, Collapse } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Box, Tab, Tabs } from '@material-ui/core';

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
    tab_panel: {
        width: 600,
    },
    info: {
        margin: theme.spacing(1),
    },
    server: {
        width: theme.spacing(8)
    },
    server_card: {
        width: theme.spacing(40),
    },
    server_details: {
        flexGrow: 1,
        display: 'flex',
        height: 600
    },
    divider: {
        marginTop: theme.spacing(20)
    },
    status_box: {
        display: 'flex',
        fontSize: theme.spacing(3),
    },
    logout: {
        marginTop: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: theme.spacing(3)
    },
    tabs: {
        width: 250,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    tab: {
        marginTop: 30,
        textTransform: 'none',
        fontSize: 18
    }
}));

function Home() {
    const token = Cookies.get('token');
    const [zone_reports, setReport] = useState([]);
    const [curr_zone, setCurrZone] = useState();
    const [details, setDetails] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const isAuthenticated = token != null ? true : false;
    const [tabValue, setTab] = useState(0);
    const classes = useStyles();
    const theme = useTheme();
    let zone_id = 0;

    useEffect(() => {
        const result = axios({
            method: 'POST',
            url: 'http://54.210.60.122:80/irods-rest/1.0.0/zone_report',
            headers: {
                'Accept': 'application/json',
                'Authorization': `${token}`
            }
        }).then(res => {
            console.log(res);
            setReport(res.data.zones);
            Cookies.set('zone_name', res.data.zones[0]['icat_server']['service_account_environment']['irods_zone_name'])
        })
    }, [isAuthenticated]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    }

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    }

    const viewDetails = event => {
        setCurrZone(zone_reports[document.getElementsByClassName(classes.server_card)[0].id]['icat_server']);
        console.log(curr_zone);
        setDetails(true);
    }

    const closeDetails = event => {
        setDetails(false);
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <div>
            {isAuthenticated == true ? <div className={classes.root}><Appbar /><Sidebar /><main className={classes.content}><div className={classes.toolbar} />
                <div className={classes.main}><Typography>Number of Server Running: {zone_reports.length}</Typography><br /><Pagination count={1} /><br />{zone_reports.length > 0 ? zone_reports.map(zone_report =>
                    <Card className={classes.server_card} id={zone_id}>
                        <CardHeader
                            avatar={
                                <img className={classes.server} id={zone_id} src={ServerIcon}></img>
                            }
                            title="Server"
                            subheader="iCAT Server"
                            action={
                                <IconButton
                                    onClick={handleExpandClick}>
                                    <ExpandMoreIcon />
                                </IconButton>
                            }
                        />
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography paragraph>Hostname: {zone_report['icat_server']['host_system_information']['hostname']}</Typography>
                                <Typography paragraph>OS Distribution Name: {zone_report['icat_server']['host_system_information']['os_distribution_name']}</Typography>
                                <Typography paragraph>OS Distribution Version: {zone_report['icat_server']['host_system_information']['os_distribution_version']}</Typography>
                                <Button onClick={viewDetails} color="primary">Details</Button>
                            </CardContent>
                            {details == true ? <Dialog open={details} className={classes.dialog} onClose={closeDetails}>
                                <DialogTitle>Server Details</DialogTitle>
                                <DialogContent className={classes.server_details}>
                                    <Tabs orientation="vertical" variant="scrollable" value={tabValue} className={classes.tabs} onChange={handleTabChange} aria-label="vertical tabs example">
                                        <Tab className={classes.tab} label="Host" {...a11yProps(0)} />
                                        <Tab className={classes.tab} label="Service" {...a11yProps(1)} />
                                        <Tab className={classes.tab} label="Plugin" {...a11yProps(2)} />
                                        <Tab className={classes.tab} label="Resource" {...a11yProps(3)} />
                                    </Tabs>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={0}>
                                        <Typography className={classes.info}>Schema Name: {curr_zone['host_access_control_config']['schema_name']}</Typography>
                                        <Typography className={classes.info}>Schema Version: {curr_zone['host_access_control_config']['schema_version']}</Typography>
                                        <Typography className={classes.info}>Catalog Schema Version: {curr_zone['version']['catalog_schema_version']}</Typography>
                                        <Typography className={classes.info}>Configuration Schema Version: {curr_zone['version']['configuration_schema_version']}</Typography>
                                        <Typography className={classes.info}>iRODS Version: {curr_zone['version']['irods_version']}</Typography>
                                        <Typography className={classes.info}>Installation Time: {curr_zone['version']['installation_time']}</Typography>
                                    </TabPanel>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={1}>
                                        <Typography className={classes.info}>iRODS Client Server Negotiation: {curr_zone['service_account_environment']['irods_client_server_negotiation']}</Typography>
                                        <Typography className={classes.info}>iRODS Client Server Policy: {curr_zone['service_account_environment']['irods_client_server_policy']}</Typography>
                                        <Typography className={classes.info}>iRODS Connection Refresh Time: {curr_zone['service_account_environment']['irods_connection_pool_refresh_time_in_seconds']}</Typography>
                                        <Typography className={classes.info}>iRODS CWD: {curr_zone['service_account_environment']['irods_cwd']}</Typography>
                                        <Typography className={classes.info}>iRODS Default Hash Scheme: {curr_zone['service_account_environment']['irods_default_hash_scheme']}</Typography>
                                        <Typography className={classes.info}>iRODS Default Resource: {curr_zone['service_account_environment']['irods_default_resource']}</Typography>
                                        <Typography className={classes.info}>iRODS Encryption Algorithm: {curr_zone['service_account_environment']['irods_encryption_algorithm']}</Typography>
                                        <Typography className={classes.info}>iRODS Encryption Key Size: {curr_zone['service_account_environment']['irods_encryption_key_size']}</Typography>
                                        <Typography className={classes.info}>iRODS Encryption Hash Rounds: {curr_zone['service_account_environment']['irods_encryption_num_hash_rounds']}</Typography>
                                        <Typography className={classes.info}>iRODS Encryption Salt Size: {curr_zone['service_account_environment']['irods_encryption_salt_size']}</Typography>
                                    </TabPanel>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={2}>
                                        <Typography className={classes.info}>Total number of Plugins: {curr_zone['plugins'].length}</Typography>
                                        <Typography className={classes.info}>{curr_zone['plugins']['0']['name']}</Typography>
                                    </TabPanel>
                                    <TabPanel className={classes.tab_panel} value={tabValue} index={3}>
                                        <Typography className={classes.info}>Hostname: {curr_zone['resources'][0]['host_name']}</Typography>
                                        <Typography className={classes.info}>Name: {curr_zone['resources'][0]['name']}</Typography>
                                        <Typography className={classes.info}>Status: {curr_zone['resources'][0]['status']}</Typography>
                                        <Typography className={classes.info}>Type: {curr_zone['resources'][0]['type']}</Typography>
                                        <Typography className={classes.info}>Vault Path: {curr_zone['resources'][0]['vault_path']}</Typography>
                                    </TabPanel>
                                </DialogContent>
                            </Dialog> : <span />}
                        </Collapse>
                    </Card>
                ) : <div><CircularProgress /> Loading...</div>}</div></main>

            </div> : <div className={classes.logout}><BlockIcon /><br /><div>Please <a href="http://localhost:3000/">login</a> to use the administration dashboard.</div></div>
            }
        </div >
    );
}

export default Home;