# Stage 1: Base
# TODO: search for a lite version of the image
FROM --platform=$BUILDPLATFORM python:3.9 AS base
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "I am running on $BUILDPLATFORM, building for $TARGETPLATFORM" > /log

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Stage 2: Builder
FROM base AS builder

# Copy source code
COPY . .

# Stage 3: Production
FROM base AS production

# Copy built code from builder stage
COPY --from=builder /app .

# Expose port
EXPOSE 8080

# Define command to run the application
CMD ["python3", "application.py"]
