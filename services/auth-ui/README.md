# Multi-Tenant Authentication UI (Svelte/SvelteKit)

A configurable authentication UI built using [Svelte](https://svelte.dev) and [SvelteKit](https://kit.svelte.dev) that supports multiple tenants. The UI dynamically renders different components (sign-up forms, social login buttons, etc.) based on tenancy configuration, which is typically determined by the domain (or subdomain) of the request.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Environment Variable Management](#configuration)
5. [Contributing](#contributing)
6. [License](#license)

---

## Overview

This project aims to provide a highly customizable login and signup experience for SaaS applications that serve multiple tenants/domains. Instead of maintaining separate authentication UIs for each tenant, this single UI can render different features and branding based on a tenant-specific configuration.

### Key highlights:

- **Domain-Based Configuration**: Tenants are identified by their domain or subdomain.
- **Feature Toggles**: Enable or disable signup, phone-based authentication, social logins, and more.
- **SvelteKit Power**: Takes advantage of SvelteKit's SSR (Server-Side Rendering), file-based routing, and data fetching.
- **Easy Theming/Styling**: Quickly customize the look and feel per tenant.

---

## Features

1. **Email/Password Login**  
   Standard email/password authentication flow, toggleable in each tenant's config.

2. **Sign Up**  
   Optionally enable or disable sign up based on the domain or feature flags.

3. **Social Login**  
   Supports multiple social login providers (e.g., Google, Facebook, GitHub) that can be toggled in configuration.

4. **Phone Sign Up**  
   Allows phone-based sign up and OTP verification if enabled in the config.

5. **Automatic Tenant Detection**  
   Identifies tenant from request domain or subdomain to fetch the correct configuration.

6. **Multi-Branding**  
   Renders distinct color schemes, logos, and text labels for each tenant.

---


## Getting Started

1. **Clone or download the repository**:
   ```bash
   git clone https://github.com/<your-organization>/multitenant-auth-ui-sveltekit.git
   cd authentication-system/services/auth-ui

2. **Install Dependencies**:
    ```bash
    npm install or pnpm install
3. **Create .env file**:
    ```bash
    cp env.example .env
4. **Run Applivation**:   
    ```bash
    npm run dev
   
### Environment Variable Management with Infisical

This application uses [Infisical](https://infisical.com/) for secure storage and management of environment variables. Infisical ensures that sensitive data such as API keys, database credentials, and OAuth secrets are encrypted and easily accessible to authorized developers.