FROM node:22

# Install necessary tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install nvm and set up the environment
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR
ENV NODE_VERSION 22

# Install nvm and configure it
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Add NVM to PATH and configure shell
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV SHELL /bin/bash

# Configure bash to load nvm automatically
RUN echo "export NVM_DIR=\"$NVM_DIR\"" >> ~/.bashrc \
    && echo "[ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\"" >> ~/.bashrc \
    && echo "[ -s \"$NVM_DIR/bash_completion\" ] && \. \"$NVM_DIR/bash_completion\"" >> ~/.bashrc \
    && echo "nvm use $NODE_VERSION" >> ~/.bashrc

# Install global packages
RUN . $NVM_DIR/nvm.sh && npm install -g @angular/cli

WORKDIR /workspace

# Verify installations on container startup
RUN echo "echo 'Node version: \$(node -v)'" >> ~/.bashrc \
    && echo "echo 'NPM version: \$(npm -v)'" >> ~/.bashrc \
    && echo "echo 'Angular CLI version: \$(ng version)'" >> ~/.bashrc
