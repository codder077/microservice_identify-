# Bitespeed Identity Reconciliation Task

**Live API Endpoint:** [https://bitespeed-backend-task-4tb4.onrender.com/identify](https://bitespeed-backend-task-4tb4.onrender.com/identify)

## Overview

This project implements an API endpoint (`/identify`) for contact identification and reconciliation. It is designed to handle requests containing email and/or phone number to identify existing contacts, create new contacts, and link contacts based on provided information, adhering to the principles of primary and secondary contact relationships.

The application is built using Node.js, Express.js, and TypeScript, and utilizes a PostgreSQL database (deployed on Render) for data persistence.

**Key Features:**

- **Contact Identification:** Identifies existing contacts based on email and phone number.
- **Primary and Secondary Contact Linking:** Establishes relationships between contacts, designating primary and secondary records based on creation time and merge requests.
- **Contact Consolidation:** Merges contact information when duplicate identities are detected, consolidating emails and phone numbers under a single primary contact.
- **REST API Endpoint (`/identify`):** Exposes a clear and functional API endpoint for interaction.

---
