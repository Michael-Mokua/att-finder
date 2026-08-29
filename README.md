# Att-Finder

A marketplace platform connecting students to industrial attachment and internship opportunities, with dedicated flows for both students seeking placements and companies posting them.

## The problem it addresses

In Kenya, finding an industrial attachment or internship is largely informal — personal networks, scattered listings, physical applications. Att-Finder gives it a structured, searchable platform: companies post opportunities with clear requirements and deadlines, students search/filter and apply directly, and both sides can track application status in one place.

## Core features

**Role-based accounts** — Users register as either a student or a company (admin role also supported), each with tailored profile fields: students have school, course, skills, and CV; companies have company name, industry, website, and description.

**Opportunity listings** — Companies post opportunities with title, description, required skills, location, duration, start/end dates, and an application deadline. Listings are typed as `attachment`, `internship`, or `both`.

**Search and discovery** — Full MongoDB text-index search across title, description, and skills, plus filtering (by any field, including comparison operators like `gte`/`lte`), sorting, field selection, and pagination — a properly built REST API rather than a flat list endpoint.

**Application workflow** — Students apply directly to listings with a cover letter; companies can move applications through a status pipeline (`applied` → `shortlisted` → `accepted`/`rejected`). Students have a dedicated "My Applications" view; companies have a "Company Opportunities" dashboard to manage what they've posted.

**Authentication** — JWT-based auth with bcrypt password hashing, protected routes on both the API (`protect` middleware) and the frontend (`PrivateRoute` component), so dashboard, application, and opportunity-management pages require login.

## Tech stack

**Frontend:** React, Redux (with dedicated action/reducer modules for auth, alerts, and opportunities), Material-UI, React Router

**Backend:** Node.js, Express, MongoDB with Mongoose, JWT authentication, bcryptjs, a structured error-handling layer (`AppError` + `catchAsync` wrapper for consistent async error handling across controllers)

## Status

Functional full-stack prototype with complete auth, opportunity CRUD, search/filter/pagination, and an application-tracking workflow implemented end-to-end across both frontend and backend.

## Setup

**Server**
```bash
cd server
npm install
# create a .env with PORT, MONGODB_URI, JWT_SECRET, NODE_ENV
npm start
```

**Client**
```bash
cd client
npm install
npm start
```
