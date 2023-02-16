# cloud-learning-platform-server

## 项目架构

本项目分为app-bff和backstage-bff两个主应用，和microservices文件下的若干微服务组成

## 项目启动

通过配置concurrently包，一键启动所有应用和微服务(每个启动命令需要用转义的引号分隔)

## 端口号

### 主应用

| 应用名称      | 端口号 |
| ------------- | ------ |
| app-bff       | 3000   |
| backstage-bff | 3001   |

### 微服务

| 微服务名称 | 依赖注入名称           | 端口号 |
| ---------- | ---------------------- |---|
| user       | microservicesUserClient | 30000  |
