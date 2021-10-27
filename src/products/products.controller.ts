import { Product } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ModifyProductDto } from './dto/request/modify-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  products(@Query() paginationQuery: PaginationQueryDto): Promise<Product[]> {
    return this.productService.products(paginationQuery);
  }

  @Get(':productId')
  product(@Param('productId') productId: string): Promise<Product> {
    return this.productService.product({ uuid: productId });
  }

  // TODO VerifyManager
  @Post()
  createProduct(@Body() productData: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(productData);
  }

  // TODO VerifyManager
  @Patch(':productId')
  modifyProduct(
    @Param('productId') productId: string,
    @Body() productData: ModifyProductDto,
  ): Promise<Product> {
    return this.productService.modifyProduct({ uuid: productId }, productData);
  }

  // TODO VerifyManager
  @Delete(':productId')
  deleteProduct(@Param('productId') productId: string): Promise<Product> {
    return this.productService.deleteProduct({ uuid: productId });
  }

  // TODO VerifyManager
  @Patch(':productId/enable')
  enableProduct(@Param('productId') productId: string): Promise<Product> {
    return this.productService.enableProduct({ uuid: productId });
  }

  // TODO VerifyManager
  @Patch(':productId/disable')
  disableProduct(@Param('productId') productId: string): Promise<Product> {
    return this.productService.disableProduct({ uuid: productId });
  }
}
