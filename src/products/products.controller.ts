import { Product } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ModifyProductDto } from './dto/request/modify-product.dto';
import { ProductsService } from './products.service';
import { plainToClass } from 'class-transformer';
import { ProductDto } from './dto/response/product.dto';
import { ProductUserDto } from './dto/response/product-user.dto';
import { QueueCollectionDto } from 'src/common/dto/queue-collection.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  async products(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<QueueCollectionDto> {
    const products = await this.productService.products(paginationQuery);

    return products;
  }

  @Get(':productId')
  async product(
    @Param('productId') productId: string,
  ): Promise<ProductUserDto> {
    const product = await this.productService.product({ uuid: productId });

    return plainToClass(ProductUserDto, product);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @HttpCode(201)
  @Post()
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productService.createProduct(productData);

    return plainToClass(ProductDto, product);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Patch(':productId')
  async modifyProduct(
    @Param('productId') productId: string,
    @Body() productData: ModifyProductDto,
  ): Promise<ProductDto> {
    const product = await this.productService.modifyProduct(
      { uuid: productId },
      productData,
    );

    return plainToClass(ProductDto, product);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Delete(':productId')
  async deleteProduct(
    @Param('productId') productId: string,
  ): Promise<ProductDto> {
    const product = await this.productService.deleteProduct({
      uuid: productId,
    });

    return plainToClass(ProductDto, product);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Patch(':productId/enable')
  async enableProduct(
    @Param('productId') productId: string,
  ): Promise<ProductDto> {
    const product = await this.productService.enableProduct({
      uuid: productId,
    });

    return plainToClass(ProductDto, product);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Patch(':productId/disable')
  async disableProduct(
    @Param('productId') productId: string,
  ): Promise<ProductDto> {
    const product = await this.productService.disableProduct({
      uuid: productId,
    });

    return plainToClass(ProductDto, product);
  }
}
