# CodingWallah

This is a educational plateform, where educators can sell their courses and students can learn about coding here on this plateform

Live Demo: [MemoryBook](https://memory-book-client.netlify.app/)

-   [Getting Started](#getting-started)
    -   [Requirements](#)
-   [Setup](#setup)
-   [Thank you!](#thank-you)

# Getting Started

## Requirements

-   [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    -   You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
-   [Nodejs](https://nodejs.org/en/)
    -   You'll know you've installed nodejs right if you can run:
        -   `node --version` and get an ouput like: `vx.x.x`
-   [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
    -   You'll know you've installed yarn right if you can run:
        -   `yarn --version` and get an output like: `x.x.x`
        -   You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

# Setup

1. clone this git repository

```
git clone https://github.com/neel045/memory-book.git
```

2. Setup environment variables:

-   create a `.env` file inside the `server `directory.
    set up all this variables inside the `.env` file

-   `DB_URI`: Go [Mongodb Atlas](https://www.mongodb.com/cloud/atlas/register) and signup create database cluster and get DB URI from dashboard.

-   `DB_PASS`: database password
-   `PORT`: port for listening backend server
-   `JWT_SECRET`: secret for encoding and decoding jwt tokens.
-   `BASE_URL`: client url
-   `MAILTRAP_HOST`: mailtrap smtp server, you can make mailtrap account [here](https://mailtrap.io/)
-   `MAILTRAP_EMAIL_PORT`: mailtrap email server port
-   `MAILTRAP_EMAIL_USER`: mailtrap email server id
-   `MAILTRAP_EMAIL_PASSWORD`: mailtrap email server password
-   `SALT`: difficulty level for password hashing suitable value is 10
-   `SENDGRID_API_KEY`: Sendgrid for sending email in production
-   `RAZORPAY_KEY_ID`: razorpay key id, you can make razorpay account [here](https://razorpay.com/)
-   `RAZORPAY_KEY_SECRET`: razorpay key secret

3. start servers

    Install node modules for backend server and start Backend Server

    ```
    cd codingwallah/server
    yarn install
    yarn dev
    ```

    Install node modules for client side and start client server

    ```
    cd codingwallah/client
    yarn install
    yarn dev
    ```

4. make sure to make public directory in server directory, inside public directory make anothre directory named img and inside img directory make users and courses directory, the users directory will store user photos and courses directory will store course thumbnails. make videos directory in public directory to store video tutorials

# Thank you!

If you appreciated this, feel free to follow me.

[![Neel Patel Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/patelneel045)
