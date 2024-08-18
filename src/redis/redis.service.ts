import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  // 添加接口
  async geoAdd(key: string, posName: string, posLoc: [number, number]) {
    return await this.redisClient.geoAdd(key, {
      longitude: posLoc[0],
      latitude: posLoc[1],
      member: posName,
    });
  }

  // 查询接口
  async geoPos(key: string, posName: string) {
    const res = await this.redisClient.geoPos(key, posName);
    return {
      name: posName,
      longitude: res[0].longitude,
      latitude: res[0].latitude,
    };
  }

  async geoList(key: string) {
    // 因为geo信息底层使用zset存储的 所以查询所有的key使用zrange
    // zset是有序列表 列表项会有一个分数 zrange是返回某个分数段的key 传入 0 -1 就是返回所有的
    const positions = await this.redisClient.zRange(key, 0, -1);
    const list = [];
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const res = await this.geoPos(key, pos);
      list.push(res);
    }
    return list;
  }

  // 搜索附近的点
  async geoSearch(key: string, pos: [number, number], radius: number) {
    const positions = await this.redisClient.geoRadius(
      key,
      {
        longitude: pos[0],
        latitude: pos[1],
      },
      radius,
      'km',
    );
    const list = [];
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const res = await this.geoPos(key, pos);
      list.push(res);
    }
    return list;
  }
}
