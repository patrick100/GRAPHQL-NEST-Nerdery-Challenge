import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ClassConstructor, Exclude, Expose } from 'class-transformer';
import { Pagination } from 'src/common/models/pagination.model';

export interface ICollectionDto<T> {
  edges: T[];
  pageInfo?: Pagination;
}

export function getCollectionDto<T>(TNodeClass: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class CollectionDto implements ICollectionDto<T> {
    @Field((type) => [TNodeClass], { nullable: true })
    edges: T[];

    @Field(() => Pagination)
    pageInfo?: Pagination;
  }

  return CollectionDto;
}
