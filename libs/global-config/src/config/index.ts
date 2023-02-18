/**
 * 导入所有配置文件，
 * 以以数组的形式，
 * 展开后放入传入ConfigModule.forRoot()配置对象的load数组
 *
 */

import microserviceConfig from './microservice.config';
export const globalConfig = [microserviceConfig];
