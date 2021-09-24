import React from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import Grid from '@mui/material/Grid';

import Sidebar from '../Sidebar';
import Header from '../Header';
import routes from '../../routes';

function Layout(props) {
    const showContentMenus = (routes) => {
        let result = null;
        if (routes.length > 0) {
            result = routes.map((route, index) => {
                return <Route key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                />
            })
        }
        return result
    }

    return (
        <Grid container spacing={2} className='app'>
            <Grid item>
                <Sidebar />
            </Grid>
            <Grid item style={{ width: 'calc(100% - 260px)' }}>
                <Header />
                <Switch>
                    {showContentMenus(routes)}
                </Switch>
            </Grid>
        </Grid>
    )
}

export default withRouter(Layout);
