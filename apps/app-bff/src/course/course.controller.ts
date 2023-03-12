import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import { AddCourseToShoppingCartDto } from '../../../../public/dto/course/add-course-to-shopping-cart.dto';

@Controller('course')
export class CourseController {
  constructor(
    @Inject('microserviceCourseClient')
    private readonly microserviceCourseClient: ClientProxy,
    @Inject('microserviceUserClient')
    private readonly microserviceUserClient: ClientProxy,
  ) {}
  //获取全部的课程列表
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-course-list')
  async getCourseList(@Request() { user: { username } }, @Body() { category }) {
    try {
      let courseList = await firstValueFrom(
        this.microserviceCourseClient.send('find-all-course', ''),
      );
      if (category) {
        console.log(category);
        courseList = courseList.filter((item) => {
          return item.courseCategory == category;
        });
      }
      let roleList = await firstValueFrom(
        this.microserviceUserClient.send('get:username:role', username),
      );
      //将roleList映射为只包含角色信息的数组
      roleList = roleList.map((item) => {
        return item.roleName;
      });
      console.log(roleList);
      /**
       * 如果用户没有管理员权限，则是返回状态为on的课程
       * 并且如果不是免费课程（coursePrice不为0）并且用户没有购买，则不返回视频url
       */
      if (!roleList.includes('管理员')) {
        let orderList = await firstValueFrom(
          this.microserviceCourseClient.send(
            'get-all-purchased-course',
            username,
          ),
        );
        //将orderList映射成值包含course的数组
        orderList = orderList.map((item) => {
          return item.courseId;
        });
        //如果课程的状态时off（不展示），则不向普通用户返回
        courseList = courseList.filter((item) => {
          return item.courseState != 'off';
        });
        //如果课程价格不为0，并且没有购买，则不反悔url
        courseList = courseList.map((item) => {
          if (item.coursePrice != 0 && !orderList.includes(item.courseId)) {
            delete item.courseVideo;
          }
          return item;
        });
        console.log(orderList);
      }
      return {
        status: 'success',
        message: '获取用户列表成功',
        data: {
          courseList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取用户列表失败: ${error.message}`,
      };
    }
  }

  //将课程加入到购物车
  @Post('add-course-to-shopping-cart')
  @UseGuards(AuthGuard('jwtStrategy'))
  async addCourseToShoppingCart(
    @Body() addCourseToShoppingCartDto: AddCourseToShoppingCartDto,
    @Request() { user: { username } },
  ) {
    try {
      //查找所有课程列表，确认课程是否存在
      const course = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-course-by-course-id',
          addCourseToShoppingCartDto.courseId,
        ),
      );
      if (!course) {
        return {
          status: 'failure',
          message: `您加入购物车的课程:${addCourseToShoppingCartDto.courseId}不存在`,
        };
      }
      //检查课程是否已经购买，如果已经购买，则不能添加近购物车
      const orderInPurchasedCourse = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-order-in-purchased-course-by-username-and-course-id',
          {
            username,
            courseId: addCourseToShoppingCartDto.courseId,
          },
        ),
      );
      if (orderInPurchasedCourse) {
        return {
          status: 'failure',
          message: '课程已购买中，请勿重复购买',
        };
      }
      //检查课程是否已经在购物车中，如果已经存在，则不能重复添加
      const orderInShoppingCart = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-order-in-shopping-cart-by-username-and-course-id',
          {
            username,
            courseId: addCourseToShoppingCartDto.courseId,
          },
        ),
      );
      if (orderInShoppingCart) {
        return {
          status: 'failure',
          message: '课程已在购物车中，请勿重复添加',
        };
      }
      //将课程添加到购物车
      await firstValueFrom(
        this.microserviceCourseClient.emit('add-course-to-shopping-cart', {
          ...addCourseToShoppingCartDto,
          username,
        }),
      );
      return {
        status: 'success',
        message: `已成功将课程${addCourseToShoppingCartDto.courseId}加入${username}的购物车`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `加入购物车失败 ${error.message}`,
      };
    }
  }
  //将订单从购物车删除

  /**
   * async函数返回的所有内容全部会被包装成Promise
   * 所以通过：async() = {return value}可以获得一个promise
   * 通过立即执行函数可以获得这个promise
   * const result = (async ()=> {return value})()
   */
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('delete-course-from-shopping-cart')
  async deleteCourseFromShoppingCart(
    @Body() { courseId },
    @Request() { user: { username } },
  ) {
    try {
      const order = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-order-in-shopping-cart-by-username-and-course-id',
          {
            username,
            courseId,
          },
        ),
      );
      if (!order) {
        return {
          status: 'failure',
          message: '待删除的课程不存在',
        };
      }
      await firstValueFrom(
        this.microserviceCourseClient.send('delete-course-from-shopping-cart', {
          username,
          courseId,
        }),
      );
      return {
        status: '删除课程成功',
        message: `以成功将${courseId}从${username}的购物车中删除`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `删除课程失败：${error.message}`,
      };
    }
  }
  //清空(删除购物车中的所有内容)购物车
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('delete-all-from-shopping-cart')
  async deleteAllFromShoppingCart(@Request() { user: { username } }) {
    try {
      //获取购物车清单
      const ordersInShoppingCartList = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-all-orders-in-shopping-cart',
          username,
        ),
      );
      const deleteCourseFunctionList = ordersInShoppingCartList.map((item) => {
        return (async () => {
          console.log('aaaaaa');
          console.log(username);
          console.log('bbbb');
          //将订单从购物车删除
          await firstValueFrom(
            this.microserviceCourseClient.send(
              'delete-course-from-shopping-cart',
              {
                username: item.username,
                courseId: item.courseId,
              },
            ),
          );
        })();
      });
      console.log(deleteCourseFunctionList);
      await Promise.all(deleteCourseFunctionList);
      return {
        status: 'success',
        message: '已删除购物车中的所有课程',
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `删除购物车中的所有内容失败${error.message}`,
      };
    }
  }
  //获取全部的购物车信息
  @Post('get-all-orders-in-shopping-cart')
  @UseGuards(AuthGuard('jwtStrategy'))
  async getAllOrdersInShoppingCart(@Request() { user: { username } }) {
    try {
      const courseInShoppingCartList = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-all-orders-in-shopping-cart',
          username,
        ),
      );
      return {
        status: 'success',
        message: `获取 ${username}的所有购物车信息成功`,
        data: {
          courseInShoppingCartList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取全部购物车信息失败: ${error.message}`,
      };
    }
  }

  //购买购物车中的全部课程
  @Post('buy-all-course-in-shopping-cart')
  @UseGuards(AuthGuard('jwtStrategy'))
  async buyAllCourseInShoppingCart(@Request() { user: { username } }) {
    try {
      //获取购物车清单
      const ordersInShoppingCartList = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-all-orders-in-shopping-cart',
          username,
        ),
      );
      console.log(ordersInShoppingCartList);
      // const buyCourseFunctionList = ordersInShoppingCartList.map(
      //   async (item) => {
      //     return new Promise((resolve, reject) => {
      //       async function doAsync() {
      //         await firstValueFrom(
      //           this.microserviceCourseClient.send(
      //             'delete-course-from-shopping-cart',
      //             {
      //               username: item.username,
      //               courseId: item.courseId,
      //             },
      //           ),
      //         );
      //         await firstValueFrom(
      //           this.microserviceCourseClient.send(
      //             'add-course-to-purchased-course',
      //             {
      //               username: item.username,
      //               courseId: item.courseId,
      //             },
      //           ),
      //         );
      //       }
      //       await doAsync.call(this);
      //       resolve('success');
      //     });
      //   },
      // );

      /**
       * async函数返回的所有内容全部会被包装成Promise
       * 所以通过：async() = {return value}可以获得一个promise
       * 通过立即执行函数可以获得这个promise
       * const result = (async ()=> {return value})()
       */
      //将购物车清单映射成执行购买造作的promise
      const buyCourseFunctionList = ordersInShoppingCartList.map((item) => {
        return (async () => {
          //将订单从购物车删除
          await firstValueFrom(
            this.microserviceCourseClient.send(
              'delete-course-from-shopping-cart',
              {
                username: item.username,
                courseId: item.courseId,
              },
            ),
          );

          //将订单加入已购课程表
          await firstValueFrom(
            this.microserviceCourseClient.send(
              'add-course-to-purchased-course',
              {
                username: item.username,
                courseId: item.courseId,
                price: item.coursePrice,
              },
            ),
          );
        })();
      });
      console.log(buyCourseFunctionList);
      await Promise.all(buyCourseFunctionList);
      return {
        status: 'success',
        message: '已购买购物车中的所有课程',
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `购买购物车中的所有课程失败：${error.message}`,
      };
    }
  }

  //直接购买课程
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('buy-course')
  async buyCourse(
    @Body() { courseId, price },
    @Request() { user: { username } },
  ) {
    console.log(courseId);
    try {
      //查找所有课程列表，确认课程是否存在
      const course = await firstValueFrom(
        this.microserviceCourseClient.send('get-course-by-course-id', courseId),
      );
      if (!course) {
        return {
          status: 'failure',
          message: '您要购买的课程不存在',
        };
      }
      //查找用户的已购课程列表，确认课程是否购买过，防止重复购买
      let purchasedCourseList = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-all-purchased-course',
          username,
        ),
      );
      purchasedCourseList = purchasedCourseList.map((item) => {
        Object.assign(item, item.course);
        delete item.course;
        return item;
      });
      const courseIdList = purchasedCourseList.map((item) => {
        return item.courseId;
      });
      if (courseIdList.includes(courseId)) {
        return {
          status: 'failure',
          message: `${username}用户的课程: ${courseId}已经购买过,请勿重负购买`,
        };
      }
      //购买课程，将课程添加到已购商品列表
      await firstValueFrom(
        this.microserviceCourseClient.send('add-course-to-purchased-course', {
          username,
          courseId,
          price,
        }),
      );
      return {
        status: 'success',
        message: `${username}已经成功购买课程${courseId}`,
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `购买课程失败: ${error.message}`,
      };
    }
  }
  //获取所有的订单
  @UseGuards(AuthGuard('jwtStrategy'))
  @Post('get-all-orders')
  async getAllOrders(@Request() { user: { username } }) {
    console.log(username);
    try {
      const orderList = await firstValueFrom(
        this.microserviceCourseClient.send(
          'get-all-purchased-course',
          username,
        ),
      );
      return {
        status: 'success',
        message: '获取订单成功',
        data: {
          orderList,
        },
      };
    } catch (error) {
      return {
        status: 'failure',
        message: `获取所有订单失败: ${error.message}`,
      };
    }
  }
}
