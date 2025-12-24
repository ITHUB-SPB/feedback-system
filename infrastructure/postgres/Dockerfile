FROM postgres:17

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget \
    curl \
    daemontools \
    cron \
    gettext-base \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    echo "Downloading WAL-G for amd64..."; \
    wget "https://github.com/wal-g/wal-g/releases/download/v3.0.7/wal-g-pg-ubuntu-20.04-amd64.tar.gz" \
    && tar -zxvf "wal-g-pg-ubuntu-20.04-amd64.tar.gz" \
    && mv "wal-g-pg-ubuntu-20.04-amd64" /usr/local/bin/wal-g \
    && chmod +x /usr/local/bin/wal-g \
    && rm "wal-g-pg-ubuntu-20.04-amd64.tar.gz" \
    && echo "WAL-G v3.0.7 installed for amd64"

RUN /usr/local/bin/wal-g --version

RUN mkdir -p /etc/wal-g/env \
    && mkdir -p /var/log/wal-g \
    && mkdir -p /scripts \
    && mkdir -p /var/spool/cron/crontabs \
    && chown -R postgres:postgres /etc/wal-g \
    && chown -R postgres:postgres /var/log/wal-g \
    && chown -R postgres:postgres /scripts

COPY ./scripts/ /scripts/
RUN cat /scripts/archive-command.sh | sed 's/\r$//' > /scripts/archive-command.sh
RUN cat /scripts/backup-cron.sh | sed 's/\r$//' > /scripts/backup-cron.sh
RUN cat /scripts/cleanup-cron.sh | sed 's/\r$//' > /scripts/cleanup-cron.sh
RUN cat /scripts/init-walg.sh | sed 's/\r$//' > /scripts/init-walg.sh
RUN cat /scripts/setup-cron.sh | sed 's/\r$//' > /scripts/setup-cron.sh
RUN chmod +x /scripts/*.sh

COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN cat /usr/local/bin/entrypoint.sh | sed 's/\r$//' > /usr/local/bin/docker-entrypoint-walg.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-walg.sh

EXPOSE 5432

ENTRYPOINT ["/usr/local/bin/docker-entrypoint-walg.sh"]
CMD ["postgres"]