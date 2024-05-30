# How to Enforce Multi-factor Authentication with Node.js
This is a companion example app for the tutorial blog post - [How to Enforce Multi-Factor Authentication with Node.js](https://stytch.com/blog/how-to-enforce-multi-factor-authentication-with-node-js/). Read the blog post to get started and follow along. 

## Overview
This exmaple app implements a MFA setup in a Node.js-based backend using [Stytch B2B SaaS Authentication](https://stytch.com/docs). Email is used as the first authentication method, and SMS-based one-time passwords (OTP) are used as the second authentication method. 
 
This example app utilizes **Node.js**, **Express**, **React**, and **Vite**. 

For an organization that doesn’t enforce MFA (and the member hasn’t opted in), the authentication flow looks like this:

<img src="https://github.com/stytchauth/stytch-blog-example-app-b2b-mfa-login-js-node/assets/114438556/eb6be280-7233-46a4-94ec-6825243835dd" width="750">

When the MFA is either enforced or opted in, your authentication flow looks like this:

<img src="https://github.com/stytchauth/stytch-blog-example-app-b2b-mfa-login-js-node/assets/114438556/bd58dc68-9723-45d9-b837-7044e848b1b7" width="750">

And finally, this is how you can toggle your MFA opt-in status if your organization allows it:

<img src="https://github.com/stytchauth/stytch-blog-example-app-b2b-mfa-login-js-node/assets/114438556/7e4d9770-6925-42ba-ab4c-8d894674938c" width="750">
