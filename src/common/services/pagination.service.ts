import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginationDto } from '../dto/pagination.dto';

export class PaginationService {
  paginationSerializer = (
    total: number,
    query: { page: number; perPage: number }, // PaginationInput,
  ): PaginationDto => {
    const { page, perPage } = query;
    const itemsPerPage = total >= perPage ? perPage : total;
    const totalPages =
      itemsPerPage > 0 ? Math.ceil(total / itemsPerPage) : null;
    const prevPage = page > 1 && page <= totalPages ? page - 1 : null;
    const nextPage = totalPages > 1 && page < totalPages ? page + 1 : null;

    return {
      perPage: itemsPerPage,
      total,
      page,
      prevPage,
      nextPage,
      totalPages,
    };
  };

  paginatedHelper(
    params: PaginationQueryDto,
  ): { skip: number; take: number } | undefined {
    if (params.page && params.perPage)
      return {
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
      };
  }
}
