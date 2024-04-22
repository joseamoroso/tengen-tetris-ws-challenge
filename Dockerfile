# Stage 1: Base
# TODO: search for a lite version of the image
FROM --platform=$BUILDPLATFORM python:3.12.3-alpine3.19 AS base
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Stage 2: Builder
FROM base AS builder

# Copy source code
COPY . .

# Stage 3: Package
FROM base AS package

# Copy built code from builder stage
COPY --from=builder /app .


# Define command to run the application
CMD ["python3", "application.py"]
