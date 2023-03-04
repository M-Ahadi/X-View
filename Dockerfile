FROM node:18.12-slim as build-stage
WORKDIR /app
COPY /frontend/package.json ./
RUN yarn
COPY /frontend/ ./
RUN yarn build


FROM python:3.11-slim
RUN apt update &&\
     apt install --no-install-recommends -y \
     nginx \
     curl \
     unzip \
     supervisor &&\
     rm -f /var/www/html/* &&\
     mkdir -p /etc/nginx/routes \
              /etc/nginx/certificate_conf &&\
     pip install gunicorn

COPY --from=build-stage /app/dist /var/www/html

COPY configs/nginx.conf /etc/nginx/nginx.conf
COPY configs/routes.conf /etc/nginx/routes/routes.conf
COPY configs/backend.conf /etc/nginx/conf.d/backend.conf

RUN curl -L https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip -o /tmp/Xray-linux-64.zip  &&\
    unzip /tmp/Xray-linux-64.zip -d /tmp/xray &&\
    mv /tmp/xray/geosite.dat /usr/local/bin/ &&\
    mv /tmp/xray/geoip.dat /usr/local/bin/ &&\
    mv /tmp/xray/xray /usr/local/bin/ &&\
    chmod +x /usr/local/bin/xray &&\
    rm -rf /tmp/xray


WORKDIR /x-view

COPY /backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY /backend/ ./

COPY configs/run.sh /run.sh
COPY configs/supervisor /etc/supervisor

RUN chmod +x /run.sh &&\
    chmod +x /etc/supervisor/stop-supervisor.sh &&\
    chmod +x /x-view/healthcheck.sh

ENV NGINX_PORT 4444
VOLUME /x-view/db

RUN apt remove -y \
    unzip &&\
    apt autoremove -y &&\
    rm -rf /var/lib/apt/lists/*

HEALTHCHECK --interval=30s --timeout=3s CMD  ./healthcheck.sh

ENTRYPOINT ["/bin/bash", "/run.sh"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]