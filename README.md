# feedback-system

## Ports

| Service | Inner Port | Outer Port |
| --- | --- | --- |
| Postgres | 5432 | 5432 |
| Pgadmin | 80 | 5050 |
| Redis | 6379 | ${REDIS_PORT} |
| Bullboard | 3000 | 7990 |
| Minio | 9000 | ${MINIO_PORT_API} |
| Minio Console | 9001 | 9001 |

[Ссылка на S3](https://selectel.ru/services/cloud/storage/?utm_source=youtube.com&utm_medium=referral&utm_campaign=help_storage_shumeiko_270524_paid)
[S3: возможности протокола и паттерны использования](https://habr.com/ru/companies/runity/articles/898710/?ysclid=mj326o2q70493955584)
[Запускаем Garage S3 в Docker](https://gavrilov.info/all/zapuskaem-garage-s3-v-docker/)


