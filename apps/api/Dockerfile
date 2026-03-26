# Stage 1: Builder
FROM rust:slim-bookworm AS builder

# Install dependensi sistem yang dibutuhkan untuk kompilasi (OpenSSL, dll)
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy seluruh source code API dan Migration
COPY . .

# Build binary API dan Migration dalam mode release
RUN cargo build --release -p api
RUN cargo build --release -p migration

# Stage 2: Runtime (Image produksi yang sangat ringan)
FROM debian:bookworm-slim

# Install OpenSSL dan CA Certificates (dibutuhkan untuk Axum dan reqwest)
RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Salin binary dari stage builder ke stage runtime
COPY --from=builder /usr/src/app/target/release/api /usr/local/bin/api
COPY --from=builder /usr/src/app/target/release/migration /usr/local/bin/migration

# Buka port 4000 sesuai dengan main.rs
EXPOSE 4000

# Perintah default saat container dijalankan
CMD ["api"]