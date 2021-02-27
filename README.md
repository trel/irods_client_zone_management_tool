# iRODS Zone Management Tool (ZMT)

A web application for managing an iRODS Zone.

## Prerequisites

### 1. iRODS Client REST Mid-Tier API

Please refer to the [iRODS Client REST API](https://github.com/irods/irods_client_rest_cpp) repository.

You will need the hostname and port of this service for the `REACT_APP_REST_API_URL` below.

### 2. Docker and Docker Compose

You will need the Docker engine and Docker Compose to launch the ZMT.

## Installation & Run

### 1. Clone the repository from GitHub

```
git clone https://github.com/irods/irods_client_zone_management_tool
```

### 2. Setup Environment Variables

Create a file named '.env' from the provided `sample.env`.

```
cd irods_client_zone_management_tool
cp setup.env .env
```

Update the `REACT_APP_REST_API_URL` value to point to where the iRODS Client REST API is running.

The other values can be updated, but already have strong defaults.

```
#######################################
# Location of the iRODS Client REST API
# protocol://host:port   e.g. http://example.org:8080

REACT_APP_REST_API_URL=

#######################################
# Defaults

LISTEN_PORT=80
REACT_APP_APPBAR_LOGO=iRODS-logo.jpg
REACT_APP_LOGIN_LOGO=iRODS-logo-1.png
REACT_APP_BRANDING_NAME=Zone Management Tool
REACT_APP_PRIMARY_COLOR=#04bdaf
```

### 5. Deploy the ZMT

#### Start Service

```
docker-compose up
```

#### Stop Service

```
docker-compose down
```

## Built With

  - [React](https://reactjs.org/) - Facebook
  - [Material UI](https://material-ui.com/) - Material Design
