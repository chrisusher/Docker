# Stage 1: Build
FROM chrisusher/playwright-chrome-slim:1.48.1

# # Install Playwright and the necessary browsers
# RUN npm install -g playwright@1.48.1 && playwright install chromium

WORKDIR /src

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Run
# FROM node:20-alpine

# Copy only the necessary files from the builder stage
# WORKDIR /src
# COPY --from=builder /src /src

# COPY ./docker/base-image/playwright-core.tar.gz /tmp/playwright-core.tar.gz

# === BAKE BROWSERS INTO IMAGE ===
# ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# RUN mkdir /ms-playwright && \
#     mkdir /ms-playwright-agent && \
#     cd /ms-playwright-agent && npm init -y && \
#     npm i /tmp/playwright-core.tar.gz && \
#     rm -rf /var/lib/apt/lists/* && \
#     rm /tmp/playwright-core.tar.gz && \
#     rm -rf /ms-playwright-agent && \
#     rm -rf ~/.npm/ && \
#     chmod -R 777 /ms-playwright

# Install Playwright in the runtime container (if needed)
# RUN npm install -g playwright@1.48.1 && playwright install chromium

# Command to run the tests
CMD ["npx", "playwright", "test", "--project=chromium"]
