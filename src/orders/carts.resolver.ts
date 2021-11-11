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
import { OrderDto } from 'src/OLD/dto/response/order.dto';
import { Order } from 'src/OLD/models/order.model';
import { UsersService } from 'src/users/users.service';
import { CartsService } from './carts.service';
import { ProductToCartInput } from './dto/input/product-to-cart.input';

@Resolver(() => Order)
export class CartsResolver {
  constructor(
    private cartService: CartsService,
    private userService: UsersService,
    private detailService: DetailsOrderService,
  ) {}

  @Query(() => Order, { name: 'cartOfUser', nullable: true })
  async cart(@Args('userUuid') uuid: string): Promise<OrderDto> {
    return this.cartService.cart({ uuid: uuid });
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
  async addProductToCart(
    @Args('cartUuid') cartUuid: string,
    @Args('productData') productData: ProductToCartInput,
  ): Promise<OrderDetail> {
    return this.cartService.addProductToCart(cartUuid, productData);
  }
}
