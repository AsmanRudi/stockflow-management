# StockFlow MVP Requirements

## Goal
A responsive inventory management web app for small businesses.

## Features
- Admin sign-in/sign-out using an HttpOnly cookie.
- Dashboard totals, low-stock list and recent stock movements.
- Product CRUD and supplier CRUD.
- Stock-in and stock-out transactions with history.
- Input validation and consistent API errors.

## Business rules
- SKU and user email must be unique.
- Price and minimum stock cannot be negative.
- Transaction quantity must be a positive integer.
- Stock cannot become negative.
- Stock updates and movement history must be committed atomically.
- Product deletion is blocked if movement history exists.

## Not included in MVP
Multi-warehouse, purchase orders, accounting, barcode integrations, and role hierarchy.
