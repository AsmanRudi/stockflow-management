# Database Design

- User 1:N StockTransaction
- Supplier 1:N Product (optional supplier on a product)
- Product 1:N StockTransaction

`Product.stock` stores current stock. Every stock movement updates that number and inserts a `StockTransaction` within one Prisma transaction. Prices are stored as PostgreSQL Decimal.
