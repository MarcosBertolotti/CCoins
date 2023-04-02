import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomPaginator extends MatPaginatorIntl {
    
  override itemsPerPageLabel = 'Elementos por página:';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
  
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const start = page * pageSize + 1;
    let end = (page + 1) * pageSize;
    if (end > length)
        end = length;
    return `${start} - ${end} registros de un total de ${length}`;
  };
}
