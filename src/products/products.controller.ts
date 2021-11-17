import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ModifyProductDto } from './dto/request/modify-product.dto';
import { ProductsService } from './products.service';
import { plainToClass } from 'class-transformer';
import { ProductDto } from './dto/response/product.dto';
import { ProductUserDto } from './dto/response/product-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import { FilesService } from 'src/files/files.service';
import { FileImageDto } from 'src/files/dto/response/file-image.dto';
import { CollectionProductModel } from './models/collection-product.model';
import { PaginationSearchByCategoryDto } from './dto/request/pagination-search-by-category.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly fileService: FilesService,
  ) {}
  @Get()
  async products(
    @Query() paginationQuery: PaginationSearchByCategoryDto,
  ): Promise<CollectionProductModel> {
    const products = await this.productService.collectionProductsForController(
      paginationQuery,
    );

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

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Patch(':productId/upload-img')
  async uploadImgProduct(
    @Request() req,
    @Param('productId') productId: string,
  ): Promise<FileImageDto> {
    const fileImage = await this.fileService.generatePresignedUrl(
      productId,
      req.user.uuid,
    );

    return fileImage;
  }

  @Get(':productId/images')
  async getImagesProduct(
    @Param('productId') productId: string,
  ): Promise<FileImageDto[]> {
    const fileImages = await this.fileService.getImagesbyProductId(productId);

    return fileImages;
  }
}
