import { OrderDetail, User } from '.prisma/client';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DetailsOrderService } from 'src/details-order/details-order.service';
import { Detail } from 'src/details-order/models/detail.model';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from './orders.service';
import { ProductToCartInput } from './dto/input/product-to-cart.input';
import { OrderDto } from './dto/response/order.dto';
import { Order } from './models/order.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import TokenPayload from 'src/interfaces/token-payload.interface';

@Resolver(() => Order)
export class CartsResolver {
  constructor(
    private cartService: OrdersService,
    private userService: UsersService,
    private detailService: DetailsOrderService,
  ) {}

  @Query(() => Order, { name: 'cartOfUser', nullable: true })
  @UseGuards(GqlAuthGuard)
  async cart(@CurrentUser() user: TokenPayload): Promise<OrderDto> {
    return this.cartService.cart({ uuid: user.uuid });
  }

  @ResolveField()
  async user(@Parent() cart: Order): Promise<User> {
    return this.userService.user({ id: cart.userId });
  }

  @ResolveField()
  async details(@Parent() cart: Order): Promise<OrderDetail[]> {
    return this.detailService.details({ uuid: cart.uuid });
  }

  @Mutation(() => Detail)
  @UseGuards(GqlAuthGuard)
  async addProductToCart(
    @Args('cartUuid') cartUuid: string,
    @Args('productData') productData: ProductToCartInput,
  ): Promise<OrderDetail> {
    return this.cartService.addProductToCart(cartUuid, productData);
  }

  @Mutation(() => Order, { name: 'cartToOrders', nullable: true })
  @UseGuards(GqlAuthGuard)
  async cartToOrders(@Args('cartUuid') cartUuid: string): Promise<OrderDto> {
    return this.cartService.cartToOrders(cartUuid);
  }

  /* Orders */
  @Query(() => Order, { name: 'orderOfMe', nullable: true })
  @UseGuards(GqlAuthGuard)
  async order(@Args('orderId') uuid: string): Promise<OrderDto> {
    return this.cartService.order({ uuid: uuid });
  }

  @Query(() => [Order], { name: 'ordersOfUser', nullable: true })
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async ordersOfUser(@Args('userId') uuid: string): Promise<OrderDto[]> {
    return this.cartService.ordersOfUser({ uuid: uuid });
  }
}
