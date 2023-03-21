# cloud-learning-platform-server

## 项目架构

本项目分为 app-bff 和 backstage-bff 两个主应用，和 microservices 文件下的若干微服务组成

## 项目启动

通过配置 concurrently 包，一键启动所有应用和微服务(每个启动命令需要用转义的引号分隔)

## 端口号

### 主应用

| 应用名称      | 端口号 |
| ------------- | ------ |
| app-bff       | 3000   |
| backstage-bff | 3001   |

### 微服务

| 微服务名称            | 依赖注入名称               | 端口号 |
| --------------------- | -------------------------- | ------ |
| microservice-user     | microserviceUserClient     | 30000  |
| microservice-role     | microserviceRoleClient     | 30001  |
| microservice-course   | microserviceCourseClient   | 30002  |
| microservice-class    | microserviceClassClient    | 30003  |
| microservice-homework | microserviceHomeworkClient | 30004  |
