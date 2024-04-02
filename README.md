
# LNCast From Triible

## Overview

LNCast is an application and tool designed for sending messages in bulk to LNAddresses on the Lightning Network.

## Features

-   Easy management via the UI
-   Sending messages to multiple addresses simultaneously
-   Real-time tracking of message delivery
-   Adding addresses from CSV files
-   Recording and listing of past messages
-   Preset feature for saving multiple address books and sending different messages to different addresses through these address books

## Requirements

- Docker

## How to Run

1. Modify the required values in the `.env` file located in the `server` directory with your Lightning Network credentials:

    LN_CERT=YOUR_LN_CERT
    LN_REFUND_MACAROON=YOUR_LN_REFUND_MACAROON
    LN_DECODE_INVOICE_MACAROON=YOUR_LN_DECODE_INVOICE_MACAROON
    LN_SOCKET=YOUR_LN_SOCKET

2. While in the root directory, run the command `docker-compose up`. Docker will handle the necessary processes and run the application.
