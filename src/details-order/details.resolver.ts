import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductDto } from 'src/products/dto/response/product.dto';
import { ProductsService } from 'src/products/products.service';
import { DetailsOrderService } from './details-order.service';
import { DetailDto } from './dto/response/detail.dto';
import { Detail } from './models/detail.model';

@Resolver(() => Detail)
export class DetailsResolver {
  constructor(
    private detailService: DetailsOrderService,
    private productService: ProductsService,
  ) {}

  @Query(() => Detail, { name: 'detail', nullable: true })
  async details(@Args('orderUuid') uuid: string): Promise<DetailDto[]> {
    return this.detailService.details({ uuid: uuid });
  }

  @ResolveField()
  async product(@Parent() detail: Detail): Promise<ProductDto> {
    return this.productService.product({ id: detail.productId });
  }
}
