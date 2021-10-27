import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class ModifyCategoryDto extends PartialType(CreateCategoryDto) {}
