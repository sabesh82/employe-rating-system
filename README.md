# 🏆 Employee Rating System

A full-stack employee rating platform built with **Next.js**, **Prisma**, **MongoDB**, and **TypeScript**. Designed to enable Owner and Supervior to evaluate employee performance through structured, secure, and scalable workflows.

---

## 📌 Features

- 🔐 **Authentication & Authorization**
  - JWT + HttpOnly Cookies
  - Role-based access (Admin, Manager, Employee)
  - Protected API routes using `privateRoute` pattern

- 📝 **Rating System**
  - Supervisors can rate employees on multiple criteria (e.g., productivity, communication, punctuality)

- 📊 **Dashboards**
  - Employee view: See personal rating trends
  - Manager view: Rate team members and view their progress
  - Admin view: Manage users, criteria, and access levels

- ⚙️ **Tech Stack**
  - **Frontend**: Next.js, Tailwind CSS, React Hook Form, Zod,TanStack Query
  - **Backend**: API Routes with Zod validation, Prisma ORM, MongoDB
  - **Auth**: JWT (in cookies), `privateRoute` helper
  - **Validation**: Zod schemas with nested refinement and regex
  - **Error Handling**: Centralized `handleError` utility
  - **UX**: Toast notifications, responsive layout, form validation

---

