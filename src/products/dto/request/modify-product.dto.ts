import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class ModifyProductDto extends PartialType(CreateProductDto) {}
